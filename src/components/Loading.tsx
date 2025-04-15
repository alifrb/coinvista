"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="text-center py-5 text-muted">
      <div className="spinner-border text-info" role="status"></div>
      <p className="mt-3">Loading data...</p>
    </div>
  );
}
