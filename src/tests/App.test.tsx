import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { MAX_NUMBER } from "../utils/runicNumberUtils";
import * as fileSaver from "file-saver";
import { readBlobAsText } from "./testUtils";

vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}));

describe("App - Integration Tests", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    render(<App />);
    user = userEvent.setup();
  });

  const VALID_NUMBER_TEST_CASES = [
    { input: "0", expectedClasses: ["z0000"] },
    { input: "5", expectedClasses: ["z5"] },
    { input: "42", expectedClasses: ["z40", "z2"] },
    { input: "123", expectedClasses: ["z100", "z20", "z3"] },
    {
      input: String(MAX_NUMBER),
      expectedClasses: ["z9000", "z900", "z90", "z9"],
    },
  ];

  const getInput = () => screen.getByLabelText(/enter a number/i);
  const getConvertButton = () =>
    screen.getByRole("button", { name: /convert/i });
  const getSvg = () => screen.getByRole("img");
  const getDownloadButton = () =>
    screen.getByRole("button", { name: /download svg/i });

  const convertNumber = async (value: string) => {
    await user.clear(getInput());
    await user.type(getInput(), value);
    await user.click(getConvertButton());
  };

  describe("Sunny Day Scenarios - Valid Number Input", () => {
    it("should allow download at initial state (0) with transparent SVG", async () => {
      await user.click(getDownloadButton());

      const [blob, filename] = vi.mocked(fileSaver.saveAs).mock.calls[0];
      expect(filename).toBe("runic-0.svg");

      const content = await readBlobAsText(blob as Blob);
      expect(content).toContain("<svg");
      expect(content).not.toContain("<path");
      expect(content).not.toContain("class=");
      expect(content).not.toContain('stroke="#000"');
    });

    VALID_NUMBER_TEST_CASES.forEach(({ input, expectedClasses }) => {
      it(`should convert valid number (${input})`, async () => {
        await convertNumber(input);
        const svg = getSvg();

        expectedClasses.forEach((cls) => {
          expect(svg).toHaveAttribute("class", expect.stringContaining(cls));
        });
        expect(
          screen.queryByText("Please enter a valid number")
        ).not.toBeInTheDocument();
      });
    });

    it("should convert decimal number (56.8) as an integer", async () => {
      const input = getInput();
      const convertButton = getConvertButton();
      await user.clear(input);
      await user.type(input, "56.8");
      await user.click(convertButton);

      const svg = getSvg();
      expect(svg).toHaveAttribute("class", expect.stringContaining("z50"));
      expect(svg).toHaveAttribute("class", expect.stringContaining("z6"));
      expect(svg).toHaveAttribute("class", expect.stringContaining("z0"));
      expect(svg).toHaveAttribute("class", expect.stringContaining("z0"));
    });

    it("should handle leading zeros (007)", async () => {
      await convertNumber("007");
      const svg = getSvg();
      expect(svg).toHaveAttribute("class", expect.stringContaining("z7"));
    });

    it("should convert using Enter key press", async () => {
      const input = getInput();

      await user.clear(input);
      await user.type(input, "7");
      await user.keyboard("{Enter}");

      const svg = getSvg();
      expect(svg).toHaveAttribute("class", expect.stringContaining("z7"));
    });

    it("should update SVG classes when converting a second number after the first", async () => {
      const input = getInput();
      const convertButton = getConvertButton();

      await user.clear(input);
      await user.type(input, "5");
      await user.click(convertButton);

      let svg = getSvg();
      expect(svg).toHaveAttribute("class", expect.stringContaining("z5"));
      expect(svg).not.toHaveAttribute("class", expect.stringContaining("z123"));

      await user.clear(input);
      await user.type(input, "123");
      await user.click(convertButton);

      svg = getSvg();
      expect(svg).toHaveAttribute("class", expect.stringContaining("z100"));
      expect(svg).toHaveAttribute("class", expect.stringContaining("z20"));
      expect(svg).toHaveAttribute("class", expect.stringContaining("z3"));
      expect(svg).not.toHaveAttribute("class", expect.stringContaining("z5"));
    });

    it("should download SVG with correct filename and content when download button is clicked", async () => {
      const input = getInput();
      const convertButton = getConvertButton();
      const downloadButton = getDownloadButton();

      await user.clear(input);
      await user.type(input, "42");
      await user.click(convertButton);

      await user.click(downloadButton);

      expect(fileSaver.saveAs).toHaveBeenCalled();
      const [blob, filename] = vi.mocked(fileSaver.saveAs).mock.calls[1];

      expect(filename).toBe("runic-42.svg");

      const content = await readBlobAsText(blob as Blob);
      expect(content).toContain("<svg");
      expect(content).toContain("<path");
      expect(content).toContain('stroke="#000"');
      expect(content).not.toContain("class=");
    });
  });

  describe("Error Scenarios - Invalid Inputs", () => {
    it("should show error for non-numeric input", async () => {
      const input = getInput();
      const convertButton = getConvertButton();

      await user.clear(input);
      await user.type(input, "abc");
      await user.click(convertButton);

      expect(
        screen.getByText("Please enter a valid number")
      ).toBeInTheDocument();
      expect(convertButton).toBeDisabled();
    });

    it("should show error for negative numbers", async () => {
      const input = getInput();
      const convertButton = getConvertButton();

      await user.clear(input);
      await user.type(input, "-5");
      await user.click(convertButton);

      expect(
        screen.getByText("Number must be greater than or equal to 0")
      ).toBeInTheDocument();
      expect(convertButton).toBeDisabled();
    });

    it("should show error for empty input", async () => {
      const input = getInput();
      const convertButton = getConvertButton();

      await user.clear(input);
      await user.click(convertButton);

      expect(
        screen.getByText("Please enter a valid number")
      ).toBeInTheDocument();
      expect(convertButton).toBeDisabled();
    });

    it("should clear error when user starts typing after error", async () => {
      const input = getInput();
      const convertButton = getConvertButton();

      await user.clear(input);
      await user.type(input, "abc");
      await user.click(convertButton);

      expect(
        screen.getByText("Please enter a valid number")
      ).toBeInTheDocument();

      await user.clear(input);
      await user.type(input, "5");

      expect(
        screen.queryByText("Please enter a valid number")
      ).not.toBeInTheDocument();
      expect(convertButton).not.toBeDisabled();
    });
  });
});
