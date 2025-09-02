export const convertTimeToMinsOrSec = (time: number) => {
  return (time > 60 ? time / 60 : time)?.toFixed();
};

export const getTimeExtension = (time: number) => {
  return time > 60 ? "mins" : "Secs";
};
