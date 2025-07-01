import Head from "next/head";
import { FC, useState } from "react";

import Format from "../components/Format";
import Standup from "../components/Standup";
import TeamSelect from "../components/TeamSelect";
import { Team, teams } from "../components/teams";

const Home: FC = () => {
  const [team, setTeam] = useState<Team>("core");
  const [teamMembers, setTeamMembers] = useState<Record<Team, string[]>>(() => {
    // Deep copy to avoid mutating the original teams object
    return Object.fromEntries(
      Object.entries(teams).map(([key, value]) => [key, [...value.members]])
    ) as Record<Team, string[]>;
  });

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
