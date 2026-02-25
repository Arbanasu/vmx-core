import Head from "next/head";
import { FC, useEffect, useState } from "react";

import dynamic from "next/dynamic";

import Format from "../components/Format";
import TeamSelect from "../components/TeamSelect";

const Standup = dynamic(() => import("../components/Standup"), { ssr: false });
import { Team, teams } from "../components/teams";

const Home: FC = () => {
  const [team, setTeam] = useState<Team>("dec");
  const [teamMembers, setTeamMembers] = useState<Record<Team, string[]>>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("standup-team-members");
      if (stored) {
        try { return JSON.parse(stored) as Record<Team, string[]>; } catch {}
      }
    }
    return Object.fromEntries(
      Object.entries(teams).map(([key, value]) => [key, [...value.members]])
    ) as Record<Team, string[]>;
  });

  useEffect(() => {
    localStorage.setItem("standup-team-members", JSON.stringify(teamMembers));
  }, [teamMembers]);

  const addMember = (member: string) => {
    setTeamMembers((prev) => ({
      ...prev,
      [team]: [...prev[team], member],
    }));
  };

  const removeMember = (member: string) => {
    setTeamMembers((prev) => ({
      ...prev,
      [team]: prev[team].filter((m) => m !== member),
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Standup</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center text-gray-700 w-full flex-1 px-20 text-center">
        <h1 className="text-5xl mb-3">
          <div className="flex items-center leading-4">
            <TeamSelect team={team} setTeam={setTeam} />
            <span className="text-blue font-bold">Standup 🙋</span>
          </div>
        </h1>
        <Standup
          key={team}
          members={teamMembers[team]}
          addMember={addMember}
          removeMember={removeMember}
        />
        <Format />
      </main>
    </div>
  );
};

export default Home;
