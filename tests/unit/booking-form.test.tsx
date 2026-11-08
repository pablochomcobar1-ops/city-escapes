import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingForm } from "@/components/contact/BookingForm";
import { isoDate, addDays } from "@/lib/booking";

it("empty submit: inline errors linked to fields, focus on the first, nothing sent", async () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch");
  const user = userEvent.setup();
  render(<BookingForm />);
  await user.click(screen.getByRole("button", { name: "Request a visit" }));

  const name = screen.getByLabelText("Your name");
  expect(name).toHaveAttribute("aria-invalid", "true");
  expect(name).toHaveAccessibleDescription("Enter your name (at least 2 letters).");
  expect(screen.getByLabelText("Mobile number")).toHaveAccessibleDescription("Enter a 10-digit Indian mobile number.");
  expect(screen.getByText("Choose 3 BHK or 4 BHK.")).toBeInTheDocument();
  expect(screen.getByText("Choose morning or evening.")).toBeInTheDocument();
  expect(name).toHaveFocus();
  expect(fetchSpy).not.toHaveBeenCalled();
});

it("fixing a field clears its error", async () => {
  const user = userEvent.setup();
  render(<BookingForm />);
  await user.click(screen.getByRole("button", { name: "Request a visit" }));
  await user.type(screen.getByLabelText("Your name"), "Aarav");
  expect(screen.getByLabelText("Your name")).not.toHaveAttribute("aria-invalid");
});

it("valid submit shows the honest demo confirmation and calls no network", async () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch");
  const user = userEvent.setup();
  render(<BookingForm />);
  await user.type(screen.getByLabelText("Your name"), "Aarav Shah");
  await user.type(screen.getByLabelText("Mobile number"), "98250 12345");
  await user.click(screen.getByLabelText("4 BHK"));
  await user.type(screen.getByLabelText("Date"), isoDate(addDays(new Date(), 3)));
  await user.click(screen.getByLabelText("Evening, 4 pm – 7 pm"));
  await user.click(screen.getByRole("button", { name: "Request a visit" }));

  const status = screen.getByRole("status");
  expect(within(status).getByText("This is a concept, so no request was sent.")).toBeInTheDocument();
  expect(within(status).getByRole("heading", { level: 2 })).toHaveTextContent("Thank you, Aarav.");
  expect(within(status).getByRole("link", { name: "Send on WhatsApp instead" })).toHaveAttribute(
    "href",
    expect.stringMatching(/^https:\/\/wa\.me\/.*text=.*4%20BHK/),
  );
  expect(fetchSpy).not.toHaveBeenCalled();
});
