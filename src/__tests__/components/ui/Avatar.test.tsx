import { describe, it, expect } from "vitest";
import { render, screen } from "../../../test/utils/render";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/ui/avatar";

describe("Avatar Components", () => {
  describe("Avatar", () => {
    it("deve renderizar sem crashar", () => {
      render(<Avatar data-testid="avatar" />);
      expect(screen.getByTestId("avatar")).toBeInTheDocument();
    });

    it("deve ter o atributo data-slot correto", () => {
      render(<Avatar data-testid="avatar" />);
      expect(screen.getByTestId("avatar")).toHaveAttribute(
        "data-slot",
        "avatar",
      );
    });

    it("deve aplicar classes base corretas", () => {
      render(<Avatar data-testid="avatar" />);
      const avatar = screen.getByTestId("avatar");
      expect(avatar).toHaveClass(
        "relative",
        "flex",
        "size-8",
        "shrink-0",
        "overflow-hidden",
        "rounded-full",
      );
    });

    it("deve aceitar className customizada", () => {
      render(
        <Avatar
          className="custom-avatar"
          data-testid="avatar"
        />,
      );
      expect(screen.getByTestId("avatar")).toHaveClass("custom-avatar");
    });

    it("deve renderizar children corretamente", () => {
      render(
        <Avatar data-testid="avatar">
          <div data-testid="avatar-child">Child content</div>
        </Avatar>,
      );
      expect(screen.getByTestId("avatar-child")).toBeInTheDocument();
    });
  });

  describe("AvatarImage", () => {
    // Note: AvatarImage with Radix UI only shows when image loads successfully
    // In test environment, images typically fail to load, so we test the structure
    it("deve renderizar Avatar com imagem (estrutura)", () => {
      render(
        <Avatar data-testid="avatar-with-image">
          <AvatarImage
            src="/test-image.jpg"
            alt="Test"
          />
          <AvatarFallback>TI</AvatarFallback>
        </Avatar>,
      );
      // Avatar container should exist
      expect(screen.getByTestId("avatar-with-image")).toBeInTheDocument();
      // Fallback should be visible since image won't load in test
      expect(screen.getByText("TI")).toBeInTheDocument();
    });

    it("deve aceitar props do AvatarImage", () => {
      // We can't directly test AvatarImage rendering because it depends on image loading
      // But we can test that the Avatar structure accepts the component
      render(
        <Avatar>
          <AvatarImage
            src="/avatar.jpg"
            alt="User Avatar"
          />
          <AvatarFallback data-testid="fallback">UA</AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByTestId("fallback")).toBeInTheDocument();
    });
  });

  describe("AvatarFallback", () => {
    it("deve renderizar sem crashar", () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="avatar-fallback">AB</AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument();
    });

    it("deve ter o atributo data-slot correto", () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="avatar-fallback">AB</AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByTestId("avatar-fallback")).toHaveAttribute(
        "data-slot",
        "avatar-fallback",
      );
    });

    it("deve aplicar classes base corretas", () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="avatar-fallback">AB</AvatarFallback>
        </Avatar>,
      );
      const fallback = screen.getByTestId("avatar-fallback");
      expect(fallback).toHaveClass(
        "bg-muted",
        "flex",
        "size-full",
        "items-center",
        "justify-center",
        "rounded-full",
      );
    });

    it("deve aceitar className customizada", () => {
      render(
        <Avatar>
          <AvatarFallback
            className="custom-fallback"
            data-testid="avatar-fallback"
          >
            AB
          </AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByTestId("avatar-fallback")).toHaveClass(
        "custom-fallback",
      );
    });

    it("deve exibir texto do fallback", () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("deve renderizar JSX como children", () => {
      render(
        <Avatar>
          <AvatarFallback>
            <span data-testid="fallback-content">👤</span>
          </AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByTestId("fallback-content")).toBeInTheDocument();
    });
  });

  describe("Composição Completa", () => {
    it("deve renderizar avatar completo com imagem e fallback", () => {
      render(
        <Avatar data-testid="complete-avatar">
          <AvatarImage
            src="/user.jpg"
            alt="User"
          />
          <AvatarFallback data-testid="avatar-fb">JD</AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByTestId("complete-avatar")).toBeInTheDocument();
      expect(screen.getByTestId("avatar-fb")).toBeInTheDocument();
    });

    it("deve manter hierarquia correta dos elementos", () => {
      render(
        <Avatar data-testid="hierarchy-avatar">
          <AvatarImage
            src="/test.jpg"
            alt="Test"
          />
          <AvatarFallback data-testid="fallback">FB</AvatarFallback>
        </Avatar>,
      );

      const avatar = screen.getByTestId("hierarchy-avatar");
      const fallback = screen.getByTestId("fallback");

      expect(avatar).toContainElement(fallback);
    });

    it("deve funcionar com diferentes tamanhos via className", () => {
      render(
        <Avatar
          className="size-12"
          data-testid="large-avatar"
        >
          <AvatarFallback>XL</AvatarFallback>
        </Avatar>,
      );

      const avatar = screen.getByTestId("large-avatar");
      expect(avatar).toHaveClass("size-12");
    });
  });

  describe("Comportamento de Fallback", () => {
    it("deve mostrar fallback quando imagem não carrega", async () => {
      render(
        <Avatar>
          <AvatarImage
            src="/nonexistent.jpg"
            alt="Broken"
          />
          <AvatarFallback data-testid="fallback-shown">NF</AvatarFallback>
        </Avatar>,
      );

      // O fallback deve estar presente (Radix UI cuida da lógica de fallback)
      expect(screen.getByTestId("fallback-shown")).toBeInTheDocument();
    });

    it("deve aceitar delayMs no fallback", async () => {
      render(
        <Avatar data-testid="avatar-with-delay">
          <AvatarFallback delayMs={600}>DF</AvatarFallback>
        </Avatar>,
      );

      // O Avatar deve ser renderizado (o comportamento do delay é interno do Radix UI)
      expect(screen.getByTestId("avatar-with-delay")).toBeInTheDocument();
    });
  });

  describe("Acessibilidade", () => {
    it("deve aceitar props de acessibilidade no Avatar", () => {
      render(
        <Avatar
          role="img"
          aria-label="User avatar"
          data-testid="accessible-avatar"
        >
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>,
      );

      const avatar = screen.getByTestId("accessible-avatar");
      expect(avatar).toHaveAttribute("role", "img");
      expect(avatar).toHaveAttribute("aria-label", "User avatar");
    });

    it("deve aceitar alt text na imagem", () => {
      render(
        <Avatar data-testid="avatar-with-alt">
          <AvatarImage
            src="/user.jpg"
            alt="Foto do perfil do usuário João"
          />
          <AvatarFallback>JP</AvatarFallback>
        </Avatar>,
      );

      // Como a imagem não carrega no ambiente de teste, testamos se o Avatar é renderizado
      expect(screen.getByTestId("avatar-with-alt")).toBeInTheDocument();
    });

    it("deve ser focável quando necessário", () => {
      render(
        <Avatar
          tabIndex={0}
          data-testid="focusable-avatar"
        >
          <AvatarFallback>FC</AvatarFallback>
        </Avatar>,
      );

      expect(screen.getByTestId("focusable-avatar")).toHaveAttribute(
        "tabIndex",
        "0",
      );
    });
  });

  describe("Casos Extremos", () => {
    it("deve renderizar apenas com Avatar (sem Image ou Fallback)", () => {
      render(<Avatar data-testid="empty-avatar" />);
      expect(screen.getByTestId("empty-avatar")).toBeInTheDocument();
    });

    it("deve renderizar apenas com Fallback", () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="only-fallback">OF</AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByTestId("only-fallback")).toBeInTheDocument();
    });

    it("deve lidar com texto longo no fallback", () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="long-fallback">
            TEXTO MUITO LONGO
          </AvatarFallback>
        </Avatar>,
      );
      expect(screen.getByTestId("long-fallback")).toBeInTheDocument();
      expect(screen.getByText("TEXTO MUITO LONGO")).toBeInTheDocument();
    });

    it("deve aceitar todas as props HTML válidas", () => {
      render(
        <Avatar
          id="avatar-id"
          title="Avatar tooltip"
          data-custom="custom-data"
          data-testid="props-avatar"
        >
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>,
      );

      const avatar = screen.getByTestId("props-avatar");
      expect(avatar).toHaveAttribute("id", "avatar-id");
      expect(avatar).toHaveAttribute("title", "Avatar tooltip");
      expect(avatar).toHaveAttribute("data-custom", "custom-data");
    });

    it("deve combinar múltiplas classes corretamente", () => {
      render(
        <Avatar
          className="custom-avatar border-2 border-blue-500"
          data-testid="styled-avatar"
        >
          <AvatarFallback className="bg-blue-100 text-blue-800">
            CB
          </AvatarFallback>
        </Avatar>,
      );

      const avatar = screen.getByTestId("styled-avatar");
      const fallback = screen.getByText("CB");

      expect(avatar).toHaveClass(
        "border-2",
        "border-blue-500",
        "custom-avatar",
      );
      expect(fallback).toHaveClass("bg-blue-100", "text-blue-800");
    });
  });
});
