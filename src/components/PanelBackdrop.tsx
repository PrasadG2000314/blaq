"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export const PanelBackdrop: React.FC = () => {
  const { isCartOpen, isFilterOpen, toggleCartDrawer, toggleFilterDrawer } = useApp();
  const isActive = isCartOpen || isFilterOpen;

  const handleBackdropClick = () => {
    toggleCartDrawer(false);
    toggleFilterDrawer(false);
  };

  return (
    <div
      id="panel-backdrop"
      className={`panel-backdrop ${isActive ? "active" : ""}`}
      onClick={handleBackdropClick}
    />
  );
};
export default PanelBackdrop;
