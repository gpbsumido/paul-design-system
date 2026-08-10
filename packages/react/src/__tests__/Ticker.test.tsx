import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Ticker } from "../Ticker";

/** Stub matchMedia so the reduced-motion hook sees the given preference. */
function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Ticker", () => {
  it("scroll mode is a labelled region that shows its children", () => {
    stubReducedMotion(false);
    render(
      <Ticker label="News ticker">
        <span>Headline</span>
      </Ticker>,
    );
    const region = screen.getByLabelText("News ticker");
    expect(region).toBeInTheDocument();
    expect(region).toHaveClass("ticker");
    expect(screen.getAllByText("Headline").length).toBeGreaterThan(0);
  });

  it("marquee mode is decorative (aria-hidden) and duplicates content for a seamless loop", () => {
    stubReducedMotion(false);
    const { container } = render(
      <Ticker label="Flavor" mode="marquee">
        <span>Hi</span>
      </Ticker>,
    );
    const root = container.querySelector(".ticker");
    expect(root).toHaveClass("ticker--marquee");
    expect(root?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getAllByText("Hi")).toHaveLength(2);
  });

  it("edge picks the border side", () => {
    stubReducedMotion(false);
    const { container } = render(
      <Ticker label="t" edge="bottom">
        <span>x</span>
      </Ticker>,
    );
    expect(container.querySelector(".ticker")).toHaveClass("ticker--bottom");
  });

  it("reduced motion collapses scroll mode to a single, plain scrollable copy", async () => {
    stubReducedMotion(true);
    render(
      <Ticker label="News ticker">
        <span>Solo</span>
      </Ticker>,
    );
    await waitFor(() => expect(screen.getAllByText("Solo")).toHaveLength(1));
  });
});

describe("Ticker clone: hidden from assistive tech, still clickable", () => {
  it("does not put the clone in the accessibility tree", () => {
    stubReducedMotion(false);
    const { container } = render(
      <Ticker label="News ticker">
        <a href="#story">Headline</a>
      </Ticker>,
    );
    const groups = [...container.querySelectorAll(".ticker__group")];
    expect(groups[1].getAttribute("aria-hidden")).toBe("true");
    expect(groups[0].hasAttribute("aria-hidden")).toBe(false);
  });

  it("drops the clone out of the tab order before paint, not after", () => {
    // Tabbable controls inside an aria-hidden container is a serious axe
    // violation, and doing this in a passive effect leaves a window where it
    // is briefly true. A layout effect runs before the browser paints.
    stubReducedMotion(false);
    const { container } = render(
      <Ticker label="News ticker">
        <a href="#story">Headline</a>
      </Ticker>,
    );
    const groups = [...container.querySelectorAll(".ticker__group")];
    expect(groups[1].querySelector("a")?.tabIndex).toBe(-1);
    // The visible copy stays fully reachable.
    expect(groups[0].querySelector("a")?.tabIndex).toBe(0);
  });

  it("never marks the clone inert, which would also block the pointer", () => {
    // This is the regression that took the fun out of the strip. `inert` hides
    // a subtree from assistive tech AND from the pointer, and the loop wraps at
    // half the width, so roughly half of what is on screen at any moment was
    // the clone -- items that silently did nothing when clicked.
    //
    // Asserted as an attribute rather than by dispatching a click, because
    // jsdom does not implement inert: a click test passes here either way and
    // would have told me nothing.
    stubReducedMotion(false);
    const { container } = render(
      <Ticker label="News ticker">
        <button type="button">Story</button>
      </Ticker>,
    );
    const groups = [...container.querySelectorAll(".ticker__group")];
    expect(groups[1].hasAttribute("inert")).toBe(false);
    expect(groups[0].hasAttribute("inert")).toBe(false);
  });

  it("leaves both copies wired to the same handler", async () => {
    stubReducedMotion(false);
    const onClick = vi.fn();
    const { container } = render(
      <Ticker label="News ticker">
        <button type="button" onClick={onClick}>
          Story
        </button>
      </Ticker>,
    );
    const groups = [...container.querySelectorAll(".ticker__group")];
    await userEvent.click(groups[0].querySelector("button")!);
    await userEvent.click(groups[1].querySelector("button")!);
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
