import LangSelector from "@/components/lang-selector"
import { renderWithMain, screen } from "@/test/utils"
import userEvent from "@testing-library/user-event"

describe("Language Selector", () => {
    it("change lang", async () => {
        renderWithMain(<LangSelector />)
        const user = userEvent.setup()

        expect(screen.getByLabelText("current-lang")).toHaveTextContent(
            /english/i,
        )

        const trigger = screen.getByRole("combobox")
        await user.click(trigger)

        const frenchOption = await screen.findByRole("option", {
            name: /français/i,
        })

        await user.click(frenchOption)

        expect(screen.getByLabelText("current-lang")).toHaveTextContent(
            /français/i,
        )

        await user.click(trigger)

        const englishOption = await screen.findByRole("option", {
            name: /english/i,
        })

        await user.click(englishOption)

        expect(screen.getByLabelText("current-lang")).toHaveTextContent(
            /english/i,
        )
    })
})
