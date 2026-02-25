import { RefreshIcon } from "@heroicons/react/outline";
import { animated, useTransition } from "@react-spring/web";
import shuffle from "lodash/shuffle";
import { FC, useEffect, useRef, useState } from "react";
import { XIcon } from "@heroicons/react/solid";

import { classNames } from "../utils";
import BigTimer from "./BigTimer";
import Celebration from "./Confetti";
import { MemberCardDetails, memberCardDetails } from "./teams";

const CARD_WIDTH = 170; // px, width of each member card

interface StandupProps {
  members: string[];
  addMember: (member: string) => void;
  removeMember: (member: string) => void;
}

const Standup: FC<StandupProps> = ({ members, addMember, removeMember }) => {
  // State for member cards, active member, shuffle/confetti, new member input, and timer
  const [memberCards, setMemberCards] = useState<MemberCardDetails[]>(memberCardDetails(members));
  const [activeMember, setActiveMember] = useState<MemberCardDetails | undefined>();
  const [isShuffled, setIsShuffled] = useState(false);
  const [isConfettiOn, setIsConfettiOn] = useState(false);
  const [timerDate, setTimerDate] = useState<number | null>(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [timerMinutes, setTimerMinutes] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("standup-timer-minutes");
      return stored ? Number(stored) : 2;
    }
    return 2;
  });

  // Web worker for updating the page title with the current member
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(new URL("../page-title-worker.ts", import.meta.url));
    workerRef.current.onmessage = (event: MessageEvent<string>) => {
      document.title = event.data;
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Update member cards when members prop changes
  useEffect(() => {
    setMemberCards(memberCardDetails(members));
  }, [members]);

  // Persist timer setting
  useEffect(() => {
    localStorage.setItem("standup-timer-minutes", String(timerMinutes));
  }, [timerMinutes]);

  // Calculate total width for the animated member cards
  let totalWidth = 0;
  const transitions = useTransition(
    memberCards.map((item) => ({
      ...item,
      x: (totalWidth += CARD_WIDTH) - CARD_WIDTH,
    })),
    {
      key: (item: MemberCardDetails) => item.name,
      from: { opacity: 0 },
      leave: { opacity: 0 },
      enter: (item) => ({ x: item.x, width: CARD_WIDTH, opacity: 1 }),
      update: (item) => ({ x: item.x, width: CARD_WIDTH }),
    }
  );

  // Shuffle member cards and trigger confetti
  const handleShuffle = () => {
    setTimerDate(Date.now() + timerMinutes * 60 * 1000);
    setMemberCards((prev) => {
      const shuffled = shuffle(prev);
      workerRef.current?.postMessage(shuffled);
      setIsShuffled(true);
      setIsConfettiOn(true);
      setActiveMember(undefined);
      return shuffled;
    });
  };

  const handleReset = () => {
    setMemberCards(memberCardDetails(members));
    setIsShuffled(false);
    setActiveMember(undefined);
    setIsConfettiOn(false);
    setTimerDate(null);
  };

  // Activate a member card (for timer/confetti)
  const handleActivateMember = (member: MemberCardDetails) => {
    setIsConfettiOn(false);
    setActiveMember(member);
    setTimerDate(Date.now() + timerMinutes * 60 * 1000);
  };

  // Handle adding a new member
  const handleAddMember = () => {
    if (newMemberName.trim()) {
      addMember(newMemberName.trim());
      setNewMemberName("");
    }
  };

  // Handle input keydown for adding member
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newMemberName.trim()) {
      handleAddMember();
    }
  };

  return (
    <div className="mb-20">
      {/* Config Section */}
      <div className="mb-8 w-full max-w-2xl mx-auto">
        <div className="relative rounded-3xl p-8 flex flex-col gap-6 border border-blue-900 bg-white shadow-2xl shadow-gray-300">
          <div className="flex flex-wrap items-center gap-4">
            <label htmlFor="timer-minutes" className="text-base text-blue-900 font-semibold whitespace-nowrap">
              Timer (minutes):
            </label>
            <input
              id="timer-minutes"
              type="number"
              min={1}
              max={60}
              className="border-none rounded-xl px-4 py-2 w-24 h-12 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-white shadow-sm hover:shadow-md transition-all"
              value={timerMinutes}
              onChange={e => {
                const val = Number(e.target.value);
                if (val >= 1 && val <= 60) setTimerMinutes(val);
              }}
              disabled={isShuffled}
            />
            <input
              type="text"
              className="border-none rounded-xl px-4 py-2 h-12 focus:ring-2 focus:ring-blue-900 focus:border-blue-900 bg-white shadow-sm hover:shadow-md transition-all"
              placeholder="Add member name"
              value={newMemberName}
              onChange={e => setNewMemberName(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            <button
              className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-2 h-12 rounded-xl font-bold shadow-md hover:shadow-lg hover:from-blue-800 hover:to-blue-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-900"
              onClick={handleAddMember}
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <p className="mt-3 mb-8 text-2xl text-gray-500">
        Our team in {isShuffled ? "standup" : "alphabetical"} order:
      </p>
      {isShuffled && timerDate && (
        <BigTimer
          autoStart={!!activeMember}
          date={timerDate}
        />
      )}
      <div className="w-full overflow-x-auto">
        <div className="relative h-40" style={{ width: totalWidth }}>
          {transitions((style, member, _, index) => (
            <animated.div
              className="absolute cursor-pointer"
              style={{ zIndex: memberCards.length - index, ...style }}
              onClick={() => handleActivateMember(member)}
            >
              <div className="relative p-5 bg-cover">
                <div
                  className={classNames(
                    "relative flex justify-center items-center bottom-0 left-0 w-full rounded-md shadow-md h-20 ease-in-out duration-300",
                    member.name === activeMember?.name && "scale-125"
                  )}
                  style={{ backgroundImage: member.css }}
                >
                  <p className="text-lg text-gray-700 font-bold drop-shadow-lg">
                    {member.name}
                  </p>
                  <button
                    className="ml-2 flex items-center justify-center w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 transition-colors border border-transparent hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400"
                    onClick={e => {
                      e.stopPropagation();
                      removeMember(member.name);
                    }}
                    title={`Remove ${member.name}`}
                  >
                    <XIcon className="w-4 h-4 text-red-500" aria-hidden="true" />
                    <span className="sr-only">Remove</span>
                  </button>
                </div>
              </div>
            </animated.div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={`inline-flex items-center gap-2 px-5 py-3 border border-transparent rounded-full shadow-sm text-white font-semibold mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
          isShuffled
            ? "bg-gray-500 hover:bg-gray-600 focus:ring-gray-400"
            : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
        }`}
        onClick={isShuffled ? handleReset : handleShuffle}
      >
        <RefreshIcon className="h-6 w-6" aria-hidden="true" />
        {isShuffled ? "Reset" : "Shuffle"}
      </button>
      <Celebration isConfettiOn={isConfettiOn} callback={() => setIsConfettiOn(false)} />
    </div>
  );
};

export default Standup;
