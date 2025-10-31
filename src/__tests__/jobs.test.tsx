import { render, screen } from "@testing-library/react";
import { JobsPage } from "../pages/JobsPage";
import { describe, it, expect } from "vitest";

describe("JobsPage", () => {
  it("renders job list", async () => {
    render(<JobsPage />);
    const header = await screen.findByText(/Jobs/i);
    expect(header).toBeInTheDocument();
  });
});
