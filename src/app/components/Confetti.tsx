import ConfettiExplosion , { ConfettiProps } from "react-confetti-explosion";

import React from "react";

const mediumProps: ConfettiProps = {
  force: 0.6,
  duration: 2500,
  particleCount: 100,
  width: 1000,
  colors: ['#9A0023', '#FF003C', '#AF739B', '#FAC7F3', '#F7DBF4'],
};

export default function Confetti() {
  return (
      <ConfettiExplosion
      {...mediumProps}
       />
  );
}
