import { LightBulbIcon } from "@heroicons/react/solid";

import { classNames } from "../utils";

const steps = [
  {
    name: "What did I work on since our last standup?",
  },
  {
    name: "What will I be working on until our next standup?",
  },
  {
    name: "What issues are blocking me?",
  },
];

const Format = () => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={classNames(stepIdx !== steps.length - 1 ? "pb-5" : "", "relative")}
          >
            <>
              {stepIdx !== steps.length - 1 ? (
                <div
                  className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-green-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-center group">
                <span className="h-9 flex items-center">
                  <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-green-500 rounded-full">
                    <LightBulbIcon
                      className="w-5 h-5 text-green-500"
                      aria-hidden="true"
                    />
                  </span>
                </span>
                <div className="ml-4 min-w-0">
                  <span className="text-sm text-gray-600 font-semibold uppercase">
                    {step.name}
                  </span>
                </div>
              </div>
            </>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Format;
