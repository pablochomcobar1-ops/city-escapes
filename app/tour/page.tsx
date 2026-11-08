import type { Metadata } from "next";
import { TourExperience } from "@/components/tour/TourExperience";

export const metadata: Metadata = {
  title: "Tour Residence 12A",
  description:
    "Walk through the Residence 12A sample flat in 3D: living room, kitchen, master bedroom and balcony, by day or by night.",
};

export default function TourPage() {
  return <TourExperience />;
}
