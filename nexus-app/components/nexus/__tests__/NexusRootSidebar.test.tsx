// @vitest-environment jsdom

import {
  cleanup,
  render,
  screen,
} from "@testing-library/react";
import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import NexusRootSidebar from "../NexusRootSidebar";

afterEach(() => {
  cleanup();
});

describe("NexusRootSidebar navigation", () => {
  it("exposes clear entry points to the owner-only founder command and bounded PPA pilot dashboard", () => {
    render(<NexusRootSidebar />);

    const founderCommandLink = screen.getByRole(
      "link",
      { name: "Founder Command" },
    );
    const ppaPilotLink = screen.getByRole(
      "link",
      { name: "PPA Pilot Dashboard" },
    );

    expect(
      founderCommandLink.getAttribute("href"),
    ).toBe("/nexus-founder-command");
    expect(
      ppaPilotLink.getAttribute("href"),
    ).toBe("/nexus-ppa-pilot-dashboard");
  });

  it("keeps operational authority labels bounded and does not advertise launch, payment, or customer execution", () => {
    render(<NexusRootSidebar />);

    expect(
      screen.getByText("Owner-only read access"),
    ).toBeTruthy();
    expect(
      screen.getByText("Internal preview only"),
    ).toBeTruthy();

    expect(
      screen.queryByRole("link", {
        name: /launch|payment|send|execute/i,
      }),
    ).toBeNull();
  });
});