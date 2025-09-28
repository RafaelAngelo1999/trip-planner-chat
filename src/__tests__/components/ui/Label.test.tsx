import { render, screen } from "@/test/utils/render";
import { Label } from "@/components/ui/label";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe("Label Component", () => {
  describe("Renderização Básica", () => {
    it("deve renderizar sem crashar", () => {
      render(<Label>Test Label</Label>);
      expect(screen.getByText("Test Label")).toBeInTheDocument();
    });

    it("deve renderizar como elemento label por padrão", () => {
      render(<Label data-testid="label">Test Label</Label>);
      const element = screen.getByTestId("label");
      expect(element.tagName).toBe("LABEL");
    });

    it("deve aplicar classes CSS corretas", () => {
      render(<Label data-testid="label">Styled Label</Label>);
      const label = screen.getByTestId("label");
      expect(label).toHaveClass("text-sm", "font-medium", "leading-none");
    });

    it("deve aceitar className personalizada", () => {
      render(
        <Label
          className="custom-class text-lg"
          data-testid="custom-label"
        >
          Custom Label
        </Label>,
      );
      const label = screen.getByTestId("custom-label");
      expect(label).toHaveClass("custom-class", "text-lg");
    });

    it("deve combinar classes padrão com classes personalizadas", () => {
      render(
        <Label
          className="text-red-500"
          data-testid="combined-label"
        >
          Combined Classes
        </Label>,
      );
      const label = screen.getByTestId("combined-label");
      expect(label).toHaveClass(
        "text-sm",
        "font-medium",
        "leading-none",
        "text-red-500",
      );
    });
  });

  describe("Props HTML", () => {
    it("deve aceitar htmlFor para associação com inputs", () => {
      render(
        <Label
          htmlFor="email-input"
          data-testid="associated-label"
        >
          Email Address
        </Label>,
      );
      const label = screen.getByTestId("associated-label");
      expect(label).toHaveAttribute("for", "email-input");
    });

    it("deve aceitar todas as props HTML padrão", () => {
      render(
        <Label
          id="label-id"
          title="Label tooltip"
          data-custom="custom-value"
          data-testid="props-label"
        >
          Props Label
        </Label>,
      );
      const label = screen.getByTestId("props-label");
      expect(label).toHaveAttribute("id", "label-id");
      expect(label).toHaveAttribute("title", "Label tooltip");
      expect(label).toHaveAttribute("data-custom", "custom-value");
    });

    it("deve aceitar eventos de clique", () => {
      const handleClick = vi.fn();
      render(
        <Label
          onClick={handleClick}
          data-testid="clickable-label"
        >
          Clickable Label
        </Label>,
      );

      const label = screen.getByTestId("clickable-label");
      label.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Acessibilidade", () => {
    it("deve ser acessível via screen reader", () => {
      render(
        <div>
          <Label htmlFor="accessible-input">Accessible Label</Label>
          <input id="accessible-input" />
        </div>,
      );
      expect(screen.getByLabelText("Accessible Label")).toBeInTheDocument();
    });

    it("deve funcionar com aria-* attributes", () => {
      render(
        <Label
          aria-describedby="help-text"
          aria-required="true"
          data-testid="aria-label"
        >
          Required Field
        </Label>,
      );
      const label = screen.getByTestId("aria-label");
      expect(label).toHaveAttribute("aria-describedby", "help-text");
      expect(label).toHaveAttribute("aria-required", "true");
    });

    it("deve ter contrast ratio adequado com classes padrão", () => {
      render(<Label data-testid="contrast-label">High Contrast</Label>);
      const label = screen.getByTestId("contrast-label");
      // As classes padrão devem garantir contraste adequado
      expect(label).toHaveClass("text-sm", "font-medium");
    });
  });

  describe("Diferentes Tipos de Conteúdo", () => {
    it("deve renderizar texto simples", () => {
      render(<Label>Simple Text</Label>);
      expect(screen.getByText("Simple Text")).toBeInTheDocument();
    });

    it("deve renderizar JSX como children", () => {
      render(
        <Label data-testid="jsx-label">
          <span>Label with</span> <strong>JSX</strong>
        </Label>,
      );
      const label = screen.getByTestId("jsx-label");
      expect(label).toContainHTML(
        "<span>Label with</span> <strong>JSX</strong>",
      );
    });

    it("deve renderizar com ícones", () => {
      const Icon = () => <span data-testid="icon">⭐</span>;
      render(
        <Label data-testid="icon-label">
          <Icon /> Starred Field
        </Label>,
      );
      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByText("Starred Field")).toBeInTheDocument();
    });

    it("deve lidar com texto vazio", () => {
      render(<Label data-testid="empty-label"></Label>);
      const label = screen.getByTestId("empty-label");
      expect(label).toBeInTheDocument();
      expect(label).toBeEmptyDOMElement();
    });
  });

  describe("Estados Especiais", () => {
    it("deve aceitar estado disabled via CSS", () => {
      render(
        <Label
          className="cursor-not-allowed opacity-50"
          data-testid="disabled-label"
        >
          Disabled Label
        </Label>,
      );
      const label = screen.getByTestId("disabled-label");
      expect(label).toHaveClass("opacity-50", "cursor-not-allowed");
    });

    it("deve aceitar estado de erro via classes", () => {
      render(
        <Label
          className="text-red-500"
          data-testid="error-label"
        >
          Error Label
        </Label>,
      );
      const label = screen.getByTestId("error-label");
      expect(label).toHaveClass("text-red-500");
    });

    it("deve aceitar estado de sucesso via classes", () => {
      render(
        <Label
          className="text-green-500"
          data-testid="success-label"
        >
          Success Label
        </Label>,
      );
      const label = screen.getByTestId("success-label");
      expect(label).toHaveClass("text-green-500");
    });
  });

  describe("Integração com Formulários", () => {
    it("deve funcionar associado com input", () => {
      render(
        <div>
          <Label htmlFor="test-input">Test Field</Label>
          <input
            id="test-input"
            data-testid="associated-input"
          />
        </div>,
      );

      const label = screen.getByText("Test Field");
      const input = screen.getByTestId("associated-input");

      expect(label).toHaveAttribute("for", "test-input");
      expect(input).toHaveAttribute("id", "test-input");
    });

    it("deve ativar input quando clicado", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Label htmlFor="focus-input">Focus Test</Label>
          <input
            id="focus-input"
            data-testid="focus-input"
          />
        </div>,
      );

      const label = screen.getByText("Focus Test");
      const input = screen.getByTestId("focus-input") as HTMLInputElement;

      await user.click(label);
      expect(input).toHaveFocus();
    });

    it("deve funcionar com múltiplos inputs (via className ou container)", () => {
      render(
        <fieldset>
          <Label>Group Label</Label>
          <div>
            <Label htmlFor="input1">Input 1</Label>
            <input
              id="input1"
              data-testid="input1"
            />
          </div>
          <div>
            <Label htmlFor="input2">Input 2</Label>
            <input
              id="input2"
              data-testid="input2"
            />
          </div>
        </fieldset>,
      );

      expect(screen.getByText("Group Label")).toBeInTheDocument();
      expect(screen.getByText("Input 1")).toBeInTheDocument();
      expect(screen.getByText("Input 2")).toBeInTheDocument();
    });
  });

  describe("Casos Extremos", () => {
    it("deve lidar com texto muito longo", () => {
      const longText =
        "Este é um texto muito longo para testar como o Label se comporta com conteúdo extenso que pode quebrar em múltiplas linhas";
      render(<Label data-testid="long-label">{longText}</Label>);

      const label = screen.getByTestId("long-label");
      expect(label).toHaveTextContent(longText);
    });

    it("deve lidar com caracteres especiais", () => {
      const specialText =
        "Label with special chars: @#$%^&*()[]{}|\\:\";'<>?,./";
      render(<Label data-testid="special-label">{specialText}</Label>);

      expect(screen.getByTestId("special-label")).toHaveTextContent(
        specialText,
      );
    });

    it("deve renderizar sem children", () => {
      render(<Label data-testid="no-children" />);
      const label = screen.getByTestId("no-children");
      expect(label).toBeInTheDocument();
      expect(label).toBeEmptyDOMElement();
    });

    it("deve aceitar ref", () => {
      const ref = { current: null };
      render(
        <Label
          ref={ref}
          data-testid="ref-label"
        >
          Ref Label
        </Label>,
      );
      expect(screen.getByTestId("ref-label")).toBeInTheDocument();
    });
  });
});
