import React from "react";
interface IWrongRedCircle {
  size?: number; // Size of the SVG (width and height)
  fillColor?: string; // Color of the tick path
  strokeColor?: string; // Color of the circle stroke
  strokeWidth?: number; // Thickness of the circle stroke
}

const WrongRedCircle = ({
  size = 18,
  fillColor = "#FF3B30",
  strokeColor = "#FF3B30",
  strokeWidth = 1.5,
}: IWrongRedCircle) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 19 18"
      fill="none"
    >
      <path
        d="M9.04387 0C4.05668 0 0 4.03679 0 9C0 13.9632 4.05647 18 9.04387 18C14.0313 18 18.0877 13.9632 18.0877 9C18.0877 4.03679 14.0313 0 9.04387 0ZM9.04387 17.0181C4.60097 17.0181 0.986704 13.4213 0.986704 9C0.986704 4.57865 4.60097 0.981917 9.04387 0.981917C13.4868 0.981917 17.101 4.57865 17.101 9C17.101 13.4213 13.4868 17.0181 9.04387 17.0181ZM12.3523 6.40131L9.74118 8.99979L12.3523 11.5983C12.5447 11.7897 12.5447 12.1006 12.3523 12.2921C12.2561 12.3878 12.1303 12.4361 12.0037 12.4361C11.8771 12.4361 11.7513 12.3878 11.6551 12.2921L9.044 9.6936L6.43286 12.2921C6.33666 12.3878 6.21087 12.4361 6.08427 12.4361C5.95767 12.4361 5.83187 12.3878 5.73568 12.2921C5.54329 12.1006 5.54329 11.7897 5.73568 11.5983L8.34683 8.99979L5.73568 6.40131C5.54329 6.20986 5.54329 5.89896 5.73568 5.7075C5.92807 5.51604 6.24048 5.51605 6.43288 5.7075L9.04402 8.30598L11.6552 5.7075C11.8476 5.51605 12.16 5.51605 12.3524 5.7075C12.5448 5.89895 12.5447 6.20985 12.3523 6.40131Z"
        fill="#FF3B30"
      />
    </svg>
  );
};

export default WrongRedCircle;
