"use client";

import { Montserrat } from "next/font/google";
import MemberCard from "../components/MemberCard";
import { Cookie } from "next/font/google";


import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Member } from '../types/member';
import type { Alumni } from '../types/alumni';

const montserrat500 = Montserrat({ subsets: ["latin"], weight: "500" });
const montserrat600 = Montserrat({ subsets: ["latin"], weight: "600" });
const cookie = Cookie({ subsets: ["latin"], weight: "400" });

export default function Members() {
    const [membersData, setMembersData] = useState<Member[]>([])
    const [alumniData, setAlumniData] = useState<Alumni[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any>(null);

    const membersRanking = {
        'President': 1,
        'Music Director': 2,
        'Assistant Music Director': 3,
        'Treasurer': 4,
        'Social Chair': 5,
    };

    async function fetchMembers() {
        const { data, error } = await supabase
            .from<'members', Member>('members')
            .select('*');

        if (error) {
            console.error('Error fetching members:', error);
            setError(error);
            setLoading(false);
            return;
        }

        const sorted = (data ?? []).sort((a, b) => {
            const orderA = membersRanking[a.position as keyof typeof membersRanking] ?? Infinity;
            const orderB = membersRanking[b.position as keyof typeof membersRanking] ?? Infinity;

            if (orderA !== orderB) {
                return orderA - orderB;
            }

            if (a.year !== b.year) {
                return a.year - b.year;
            }

            // Sort alphabetically by last_name (case-insensitive)
            return a.last_name.localeCompare(b.last_name, undefined, { sensitivity: 'base' });
        });

        setMembersData(sorted);
        setLoading(false);
    }

    async function fetchAlumni() {
        const { data, error } = await supabase
            .from('alumni')
            .select('*');

        if (error) {
            console.error('Error fetching alumni:', error);
            throw error;
        }

        const sorted = (data ?? []).sort((a, b) => {
            if (a.year !== b.year) {
                return a.year - b.year; // older year first
            }
            // same year → compare last names alphabetically, case-insensitive
            return a.last_name.localeCompare(b.last_name, undefined, { sensitivity: 'base' });
        });

        setAlumniData(sorted);
    }


    useEffect(() => {
            fetchMembers();
            fetchAlumni();
        }, []);

        if (loading) {
            return <div></div>
        }

        if (error) {
            return <div>Error loading data: {error.message}</div>
        }

        return (
            <div>
                {/* Members Section */}
                <div className="w-full h-full flex flex-col items-center text-center pb-10">
                    <div
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/professional_background.jpg')",
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '100%',
                            height: '200px',
                        }}
                        className="flex items-center justify-center text-white text-6xl"
                    >
                        <h1 className={montserrat600.className}>Current Members</h1>
                    </div>
                    <br />
                    <br />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full lg:w-[90%] px-4 py-6 md:gap-x-2 lg:gap-x-8 xl:gap-x-16">
                        {membersData?.map((member) => (
                            <MemberCard
                                key={member.key}
                                first_name={member.first_name}
                                last_name={member.last_name}
                                image={member.image_url || '/anonymous.png'}
                                position={member.position || ''}
                                year={member.year}
                            />
                        ))}
                    </div>
                </div>
                {/* Alumni Section */}
                <div>
                    <h2 className={cookie.className + ' text-chai-dark-blue text-5xl font-bold mb-4 text-decoration-line: underline flex items-center justify-center'}>Alumni</h2>
                    <div className={montserrat600.className + ' flex flex-col items-center text-center pb-10 text-chai-dark-blue text-xl'}>
                        {alumniData?.map((alumni) => (
                            <div key={alumni.id}>{alumni.first_name} {alumni.last_name} ({alumni.year})</div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }