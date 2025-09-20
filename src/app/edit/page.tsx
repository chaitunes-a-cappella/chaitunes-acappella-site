"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import type { Member } from '../types/member';
import type { Alumni } from '../types/alumni';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditPage() {
    const [alumni, setAlumni] = useState<Alumni[]>([]);
    const [members, setMembers] = useState<Member[]>([]);

    const [newAlumnus, setNewAlumnus] = useState<Partial<Alumni>>({});
    const [newMember, setNewMember] = useState<Partial<Member>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageError, setImageError] = useState("");

    const [editMember, setEditMember] = useState<Member | null>(null);
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editImageError, setEditImageError] = useState("");

    const [editAlumnus, setEditAlumnus] = useState<Alumni | null>(null);

    // Refs for resetting file inputs after submit
    const imageFileInputRef = useRef<HTMLInputElement>(null);
    const editImageFileInputRef = useRef<HTMLInputElement>(null);

    const montserrat = { className: "font-montserrat" };

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const { data: alumniData, error: alumniError } = await supabase
            .from("alumni")
            .select("*")
            .order("year", { ascending: false });

        const { data: memberData, error: memberError } = await supabase
            .from("members")
            .select("*")
            .order("year", { ascending: false });

        if (alumniError) {
            console.error("Error fetching alumni:", alumniError);
        } else if (alumniData) {
            setAlumni(alumniData);
        }

        if (memberError) {
            console.error("Error fetching members:", memberError);
        } else if (memberData) {
            setMembers(memberData);
        }
    }

    async function handleAlumniSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!newAlumnus.first_name || !newAlumnus.last_name || !newAlumnus.year) return;

        const { error } = await supabase.from("alumni").insert(newAlumnus);

        if (error) {
            console.error("Error inserting alumni:", error);
            return;
        }

        setNewAlumnus({});
        fetchData();
    }

    async function handleMemberSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!newMember.first_name || !newMember.last_name || !newMember.year) {
            setImageError("Please fill out required fields.");
            return;
        }

        let imageUrl = newMember.image_url || "";

        if (imageFile) {
            const isSquare = await validateImageIsSquare(imageFile);
            if (!isSquare) {
                setImageError("Image must be square.");
                return;
            }
            const mimeType = imageFile.type;
            const extension = mimeType.split('/').pop();
            const { data, error: uploadError } = await supabase.storage
                .from("member-photos")
                .upload(`${newMember.first_name}_${newMember.last_name}.${extension}`, imageFile);

            if (uploadError) {
                console.error("Image upload error:", uploadError);
                setImageError("Failed to upload image.");
                return;
            }

            if (data) {
                imageUrl = supabase.storage.from("member-photos").getPublicUrl(data.path).data.publicUrl;
            }
        }

        const { error } = await supabase
            .from("members")
            .insert({ ...newMember, image_url: imageUrl });

        if (error) {
            console.error("Error inserting member:", error);
            setImageError("Failed to add member.");
            return;
        }

        setNewMember({});
        setImageFile(null);
        setImageError("");

        if (imageFileInputRef.current) {
            imageFileInputRef.current.value = "";
        }

        fetchData();
    }

    async function validateImageIsSquare(file: File): Promise<boolean> {
        return new Promise((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve(img.width === img.height);
            img.src = URL.createObjectURL(file);
        });
    }

    async function saveMemberEdit(key: number) {
        if (!editMember) return;

        let imageUrl = editMember.image_url || "";

        if (editImageFile) {
            const isSquare = await validateImageIsSquare(editImageFile);
            if (!isSquare) {
                setEditImageError("Image must be square.");
                return;
            }

            const mimeType = editImageFile.type;
            const extension = mimeType.split('/').pop();
            const { data, error: uploadError } = await supabase.storage
                .from("member-photos")
                .upload(`${editMember.first_name}_${editMember.last_name}.${extension}`, editImageFile);

            if (uploadError) {
                console.error("Image upload error:", uploadError);
                setEditImageError("Failed to upload image.");
                return;
            }

            if (data) {
                imageUrl = supabase.storage.from("member-photos").getPublicUrl(data.path).data.publicUrl;
            }
        }

        const updatePayload = { ...editMember, image_url: imageUrl };

        // Remove undefined keys from update payload to avoid errors
        Object.keys(updatePayload).forEach(key => {
            if (updatePayload[key as keyof typeof updatePayload] === undefined) {
                delete updatePayload[key as keyof typeof updatePayload];
            }
        });

        const { error } = await supabase
            .from("members")
            .update(updatePayload)
            .eq("key", key);

        if (error) {
            console.error("Error updating member:", error);
            setEditImageError("Failed to save member.");
            return;
        }

        setEditMember(null);
        setEditImageFile(null);
        setEditImageError("");

        if (editImageFileInputRef.current) {
            editImageFileInputRef.current.value = "";
        }

        fetchData();
    }

    async function deleteMember(key: number) {
        const member = members.find(m => m.key === key);
        if (!member) return;

        let imagePath: string | null = null;
        if (member.image_url) {
            try {
                const url = new URL(member.image_url);
                const prefix = `/storage/v1/object/public/member-photos/`;
                if (url.pathname.startsWith(prefix)) {
                    imagePath = url.pathname.slice(prefix.length);
                }
            } catch (err) {
                console.error("Invalid image URL:", member.image_url);
            }
        }

        const { error: deleteError } = await supabase.from("members").delete().eq("key", key);
        if (deleteError) {
            console.error("Failed to delete member record:", deleteError);
            return;
        }

        if (imagePath) {
            const { error: storageError } = await supabase.storage.from("member-photos").remove([imagePath]);
            if (storageError) {
                console.error("Failed to delete image from storage:", storageError);
            } else {
                console.log("Image deleted from storage:", imagePath);
            }
        }

        fetchData();
    }



    async function saveAlumnusEdit(id: number) {
        if (!editAlumnus) return;

        // Clean undefined keys from editAlumnus before update
        const updatePayload = { ...editAlumnus };
        Object.keys(updatePayload).forEach(key => {
            if (updatePayload[key as keyof typeof updatePayload] === undefined) {
                delete updatePayload[key as keyof typeof updatePayload];
            }
        });

        const { error } = await supabase.from("alumni").update(updatePayload).eq("id", id);

        if (error) {
            console.error("Error updating alumnus:", error);
            return;
        }

        setEditAlumnus(null);
        fetchData();
    }

    async function deleteAlumnus(id: number) {
        const { error } = await supabase.from("alumni").delete().eq("id", id);
        if (error) {
            console.error("Error deleting alumnus:", error);
        } else {
            fetchData();
        }
    }

    return (
        <div className="text-[#f0ede7] mt-20 mb-32 px-6 space-y-24">
            {/* Members Section */}
            <form
                onSubmit={handleMemberSubmit}
                className={montserrat.className + " bg-chai-dark-blue shadow-md rounded-lg p-6 max-w-3xl mx-auto flex flex-col gap-4"}
            >
                <h2 className="text-4xl font-semibold mb-4 text-center text-chai-light-blue">Edit Members</h2>
                <input
                    type="text"
                    placeholder="First Name"
                    value={newMember.first_name || ""}
                    onChange={(e) => setNewMember({ ...newMember, first_name: e.target.value })}
                    required
                    className="bg-chai-dark-blue border border-chai-light-blue p-3 rounded"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={newMember.last_name || ""}
                    onChange={(e) => setNewMember({ ...newMember, last_name: e.target.value })}
                    required
                    className="bg-chai-dark-blue border border-chai-light-blue p-3 rounded"
                />
                <input
                    type="number"
                    placeholder="Year"
                    value={newMember.year || ""}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setNewMember({ ...newMember, year: isNaN(val) ? undefined : val });
                    }}
                    required
                    className="bg-chai-dark-blue border border-chai-light-blue p-3 rounded"
                />
                <input
                    type="text"
                    placeholder="Position (optional)"
                    value={newMember.position || ""}
                    onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                    className="bg-chai-dark-blue border border-chai-light-blue p-3 rounded"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    ref={imageFileInputRef}
                    className="bg-chai-dark-blue border border-chai-light-blue p-3 rounded text-white"
                />
                {imageError && <p className="text-red-500">{imageError}</p>}
                <button type="submit" className="bg-chai-light-blue text-chai-dark-blue font-semibold py-3 rounded">Add Member</button>

                <ul className="space-y-4 mt-6">
                    {members.map((m) =>
                        editMember?.key === m.key ? (
                            <li key={m.key} className="space-y-2">
                                <input
                                    type="text"
                                    value={editMember.first_name}
                                    onChange={(e) => setEditMember({ ...editMember, first_name: e.target.value })}
                                    className="bg-chai-dark-blue border p-2 rounded w-full"
                                />
                                <input
                                    type="text"
                                    value={editMember.last_name}
                                    onChange={(e) => setEditMember({ ...editMember, last_name: e.target.value })}
                                    className="bg-chai-dark-blue border p-2 rounded w-full"
                                />
                                <input
                                    type="text"
                                    value={editMember.position || ""}
                                    onChange={(e) => setEditMember({ ...editMember, position: e.target.value })}
                                    className="bg-chai-dark-blue border p-2 rounded w-full"
                                />
                                <input
                                    type="number"
                                    value={editMember.year}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setEditMember({ ...editMember, year: isNaN(val) ? undefined : val });
                                    }}
                                    className="bg-chai-dark-blue border p-2 rounded w-full"
                                    required
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                                    ref={editImageFileInputRef}
                                    className="bg-chai-dark-blue border p-2 rounded text-white w-full"
                                />
                                {editImageError && <p className="text-red-500">{editImageError}</p>}
                                <div className="flex gap-2">
                                    <button onClick={() => saveMemberEdit(m.key)} type="button" className="bg-green-500 text-white px-4 py-1 rounded">Save</button>
                                    <button onClick={() => setEditMember(null)} type="button" className="bg-gray-500 text-white px-4 py-1 rounded">Cancel</button>
                                </div>
                            </li>
                        ) : (
                            <li key={m.key} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {m.image_url && (
                                        <Image src={m.image_url} alt={`${m.first_name} ${m.last_name}`} width={40} height={40} className="rounded-full" />
                                    )}
                                    <span>{m.first_name} {m.last_name} – {m.year} {m.position && `(${m.position})`}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditMember(m)} type="button" className="text-blue-400 hover:underline">Edit</button>
                                    <button onClick={() => deleteMember(m.key)} type="button" className="text-red-400 hover:underline">Delete</button>
                                </div>
                            </li>
                        )
                    )}
                </ul>
            </form>

            {/* Alumni Section */}
            <form
                onSubmit={handleAlumniSubmit}
                className={montserrat.className + " bg-chai-dark-blue shadow-md rounded-lg p-6 max-w-3xl mx-auto flex flex-col gap-4"}
            >
                <h2 className="text-4xl font-semibold mb-4 text-center text-chai-light-blue">Edit Alumni</h2>
                <input
                    type="text"
                    placeholder="First Name"
                    value={newAlumnus.first_name || ""}
                    onChange={(e) => setNewAlumnus({ ...newAlumnus, first_name: e.target.value })}
                    required
                    className="bg-chai-dark-blue border border-chai-light-blue p-3 rounded"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={newAlumnus.last_name || ""}
                    onChange={(e) => setNewAlumnus({ ...newAlumnus, last_name: e.target.value })}
                    required
                    className="bg-chai-dark-blue border border-chai-light-blue p-3 rounded"
                />
                <input
                    type="number"
                    placeholder="Year"
                    value={newAlumnus.year || ""}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setNewAlumnus({ ...newAlumnus, year: isNaN(val) ? undefined : val });
                    }}
                    required
                    className="bg-chai-dark-blue border border-chai-light-blue p-3 rounded"
                />
                <button type="submit" className="bg-chai-light-blue text-chai-dark-blue font-semibold py-3 rounded">Add Alumnus</button>

                <ul className="space-y-3 mt-6">
                    {alumni.map((a) =>
                        editAlumnus?.id === a.id ? (
                            <li key={a.id} className="space-y-2">
                                <input
                                    type="text"
                                    value={editAlumnus.first_name}
                                    onChange={(e) => setEditAlumnus({ ...editAlumnus, first_name: e.target.value })}
                                    className="bg-chai-dark-blue border p-2 rounded w-full"
                                />
                                <input
                                    type="text"
                                    value={editAlumnus.last_name}
                                    onChange={(e) => setEditAlumnus({ ...editAlumnus, last_name: e.target.value })}
                                    className="bg-chai-dark-blue border p-2 rounded w-full"
                                />
                                <input
                                    type="number"
                                    value={editAlumnus.year}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setEditAlumnus({ ...editAlumnus, year: isNaN(val) ? undefined : val });
                                    }}
                                    className="bg-chai-dark-blue border p-2 rounded w-full"
                                    required
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => saveAlumnusEdit(a.id)} type="button" className="bg-green-500 text-white px-4 py-1 rounded">Save</button>
                                    <button onClick={() => setEditAlumnus(null)} type="button" className="bg-gray-500 text-white px-4 py-1 rounded">Cancel</button>
                                </div>
                            </li>
                        ) : (
                            <li key={a.id} className="flex items-center justify-between">
                                <span>{a.first_name} {a.last_name} – {a.year}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditAlumnus(a)} type="button" className="text-blue-400 hover:underline">Edit</button>
                                    <button onClick={() => deleteAlumnus(a.id)} type="button" className="text-red-400 hover:underline">Delete</button>
                                </div>
                            </li>
                        )
                    )}
                </ul>
            </form>
        </div>
    );
}
