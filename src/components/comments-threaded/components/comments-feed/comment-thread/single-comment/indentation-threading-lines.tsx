function IndentationThreadingLines({ isLastReply }: { isLastReply: boolean }) {
  return (
    <>
      {!isLastReply && (
        <div
          className="absolute w-px bg-gray-300 dark:bg-gray-500 z-0 h-full"
          style={{ left: "-12px", top: "0px" }}
        />
      )}

      <div
        className="absolute w-px bg-gray-300 dark:bg-gray-500 z-0"
        style={{ top: "-8px", height: "18px", left: "-12px" }}
      />

      <div
        className="absolute z-0 border-l-[1.5px] border-b-[1.5px] border-gray-300 dark:border-gray-500 border-t-[1.5px] border-t-transparent border-r-[1.5px] border-r-transparent rounded-bl-xl"
        style={{ top: "10px", width: "12px", height: "16px", left: "-12px" }}
      />
    </>
  );
}

export default IndentationThreadingLines;
