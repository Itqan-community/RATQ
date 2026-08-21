import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ConsumerAvatar } from "@/modules/resources/components/ConsumerAvatar";
import type { Consumer } from "@/types/resource";

const consumer: Consumer = {
    name: "Quran Foundation",
    website_url: "https://example.com",
};

describe("ConsumerAvatar accessibility", () => {
    it("provides an accessible name for a clickable consumer avatar", () => {
        render(<ConsumerAvatar consumer={consumer} size="featured" />);

        expect(
            screen.getByRole("link", { name: "Quran Foundation" }),
        ).toBeInTheDocument();
    });
});
