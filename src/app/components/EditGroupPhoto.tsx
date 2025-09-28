import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { supabase } from "../lib/supabase";

export default function EditGroupPhoto() {
    const [groupPhotoUrl, setGroupPhotoUrl] = useState<string | null>(null);
    const [groupPhotoFile, setGroupPhotoFile] = useState<File | null>(null);
    const [groupPhotoError, setGroupPhotoError] = useState("");
    const groupPhotoInputRef = useRef<HTMLInputElement>(null);

    const fixedFileName = "group_photo.jpg"; // fixed upload name with forced .jpg extension

    useEffect(() => {
        async function fetchGroupPhoto() {
            const { data } = supabase.storage
                .from("group-photo")
                .getPublicUrl(fixedFileName);

            if (data?.publicUrl) {
                // Add cache-busting timestamp to prevent old image sticking
                setGroupPhotoUrl(`${data.publicUrl}?t=${Date.now()}`);
            }
        }
        fetchGroupPhoto();
    }, []);

    async function handleGroupPhotoUpload(e: React.FormEvent) {
        e.preventDefault();
        setGroupPhotoError("");

        if (!groupPhotoFile) {
            setGroupPhotoError("Please select a photo to upload.");
            return;
        }

        // Convert the selected file to a new File object with fixed filename "group_photo.jpg"
        const renamedFile = new File([groupPhotoFile], fixedFileName, {
            type: groupPhotoFile.type,
        });

        // Upload with fixed name (forced .jpg extension)
        const { error } = await supabase.storage
            .from("group-photo")
            .upload(fixedFileName, renamedFile, {
                upsert: true,
                contentType: renamedFile.type,
            });

        if (error) {
            setGroupPhotoError("Failed to upload group photo.");
            console.error("Upload error:", error);
            return;
        }

        const publicUrl = supabase.storage
            .from("group-photo")
            .getPublicUrl(fixedFileName).data.publicUrl;

        setGroupPhotoUrl(`${publicUrl}?t=${Date.now()}`); // bust cache
        setGroupPhotoFile(null);
        if (groupPhotoInputRef.current) groupPhotoInputRef.current.value = "";
    }

    return (
        <div className="bg-chai-dark-blue p-6 rounded-lg max-w-3xl mx-auto shadow-md">
            <h2 className="text-4xl font-semibold mb-4 text-center text-chai-light-blue">
                Edit Group Photo
            </h2>
            <p className="text-sm text-chai-light-blue mb-4 text-left">
                Current group photo:
            </p>
            {groupPhotoUrl ? (
                <Image
                    src={groupPhotoUrl}
                    alt="Group Photo"
                    className="mb-6 w-full h-auto rounded"
                    style={{ objectFit: "cover" }}
                    width={550}
                    height={300}
                    priority
                />
            ) : (
                <p className="text-sm text-chai-light-blue mb-6 text-center">
                    No photo uploaded yet.
                </p>
            )}

            <p className="text-sm text-chai-light-blue mb-2">
                Please upload any photo file. It will be renamed to <code>group_photo.jpg</code>.
            </p>

            <form onSubmit={handleGroupPhotoUpload} className="flex flex-col gap-4">
                <input
                    type="file"
                    accept="image/*"
                    ref={groupPhotoInputRef}
                    onChange={(e) => setGroupPhotoFile(e.target.files?.[0] ?? null)}
                    className="bg-chai-dark-blue border border-chai-light-blue p-3 rounded text-white"
                />
                {groupPhotoError && (
                    <p className="text-red-600 text-sm">{groupPhotoError}</p>
                )}
                <button
                    type="submit"
                    className="bg-chai-light-blue text-chai-dark-blue font-semibold py-3 rounded hover:bg-chai-light-blue/90 transition"
                >
                    Upload New Photo
                </button>
            </form>
        </div>
    );
}

