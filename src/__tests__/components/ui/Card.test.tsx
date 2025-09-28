import { describe, it, expect } from "vitest";
import { render, screen } from "../../../test/utils/render";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../components/ui/card";

describe("Card Components", () => {
  describe("Card", () => {
    it("deve renderizar sem crashar", () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId("card")).toBeInTheDocument();
    });

    it("deve ter o atributo data-slot correto", () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId("card")).toHaveAttribute("data-slot", "card");
    });

    it("deve aplicar classes base corretas", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass(
        "bg-card",
        "text-card-foreground",
        "flex",
        "flex-col",
        "gap-6",
        "rounded-xl",
        "border",
        "py-6",
        "shadow-sm",
      );
    });

    it("deve aceitar className customizada", () => {
      render(
        <Card
          className="custom-class"
          data-testid="card"
        >
          Content
        </Card>,
      );
      expect(screen.getByTestId("card")).toHaveClass("custom-class");
    });

    it("deve renderizar children corretamente", () => {
      render(<Card>Test Content</Card>);
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
  });

  describe("CardHeader", () => {
    it("deve renderizar sem crashar", () => {
      render(<CardHeader data-testid="card-header">Header</CardHeader>);
      expect(screen.getByTestId("card-header")).toBeInTheDocument();
    });

    it("deve ter o atributo data-slot correto", () => {
      render(<CardHeader data-testid="card-header">Header</CardHeader>);
      expect(screen.getByTestId("card-header")).toHaveAttribute(
        "data-slot",
        "card-header",
      );
    });

    it("deve aplicar classes base corretas", () => {
      render(<CardHeader data-testid="card-header">Header</CardHeader>);
      const header = screen.getByTestId("card-header");
      expect(header).toHaveClass("flex", "flex-col", "gap-1.5", "px-6");
    });

    it("deve aceitar className customizada", () => {
      render(
        <CardHeader
          className="custom-header"
          data-testid="card-header"
        >
          Header
        </CardHeader>,
      );
      expect(screen.getByTestId("card-header")).toHaveClass("custom-header");
    });
  });

  describe("CardTitle", () => {
    it("deve renderizar sem crashar", () => {
      render(<CardTitle data-testid="card-title">Title</CardTitle>);
      expect(screen.getByTestId("card-title")).toBeInTheDocument();
    });

    it("deve ter o atributo data-slot correto", () => {
      render(<CardTitle data-testid="card-title">Title</CardTitle>);
      expect(screen.getByTestId("card-title")).toHaveAttribute(
        "data-slot",
        "card-title",
      );
    });

    it("deve aplicar classes base corretas", () => {
      render(<CardTitle data-testid="card-title">Title</CardTitle>);
      const title = screen.getByTestId("card-title");
      expect(title).toHaveClass("leading-none", "font-semibold");
    });

    it("deve aceitar className customizada", () => {
      render(
        <CardTitle
          className="custom-title"
          data-testid="card-title"
        >
          Title
        </CardTitle>,
      );
      expect(screen.getByTestId("card-title")).toHaveClass("custom-title");
    });
  });

  describe("CardDescription", () => {
    it("deve renderizar sem crashar", () => {
      render(
        <CardDescription data-testid="card-description">
          Description
        </CardDescription>,
      );
      expect(screen.getByTestId("card-description")).toBeInTheDocument();
    });

    it("deve ter o atributo data-slot correto", () => {
      render(
        <CardDescription data-testid="card-description">
          Description
        </CardDescription>,
      );
      expect(screen.getByTestId("card-description")).toHaveAttribute(
        "data-slot",
        "card-description",
      );
    });

    it("deve aplicar classes base corretas", () => {
      render(
        <CardDescription data-testid="card-description">
          Description
        </CardDescription>,
      );
      const description = screen.getByTestId("card-description");
      expect(description).toHaveClass("text-muted-foreground", "text-sm");
    });

    it("deve aceitar className customizada", () => {
      render(
        <CardDescription
          className="custom-desc"
          data-testid="card-description"
        >
          Description
        </CardDescription>,
      );
      expect(screen.getByTestId("card-description")).toHaveClass("custom-desc");
    });
  });

  describe("CardContent", () => {
    it("deve renderizar sem crashar", () => {
      render(<CardContent data-testid="card-content">Content</CardContent>);
      expect(screen.getByTestId("card-content")).toBeInTheDocument();
    });

    it("deve ter o atributo data-slot correto", () => {
      render(<CardContent data-testid="card-content">Content</CardContent>);
      expect(screen.getByTestId("card-content")).toHaveAttribute(
        "data-slot",
        "card-content",
      );
    });

    it("deve aplicar classes base corretas", () => {
      render(<CardContent data-testid="card-content">Content</CardContent>);
      const content = screen.getByTestId("card-content");
      expect(content).toHaveClass("px-6");
    });

    it("deve aceitar className customizada", () => {
      render(
        <CardContent
          className="custom-content"
          data-testid="card-content"
        >
          Content
        </CardContent>,
      );
      expect(screen.getByTestId("card-content")).toHaveClass("custom-content");
    });
  });

  describe("CardFooter", () => {
    it("deve renderizar sem crashar", () => {
      render(<CardFooter data-testid="card-footer">Footer</CardFooter>);
      expect(screen.getByTestId("card-footer")).toBeInTheDocument();
    });

    it("deve ter o atributo data-slot correto", () => {
      render(<CardFooter data-testid="card-footer">Footer</CardFooter>);
      expect(screen.getByTestId("card-footer")).toHaveAttribute(
        "data-slot",
        "card-footer",
      );
    });

    it("deve aplicar classes base corretas", () => {
      render(<CardFooter data-testid="card-footer">Footer</CardFooter>);
      const footer = screen.getByTestId("card-footer");
      expect(footer).toHaveClass("flex", "items-center", "px-6");
    });

    it("deve aceitar className customizada", () => {
      render(
        <CardFooter
          className="custom-footer"
          data-testid="card-footer"
        >
          Footer
        </CardFooter>,
      );
      expect(screen.getByTestId("card-footer")).toHaveClass("custom-footer");
    });
  });

  describe("Composição Completa", () => {
    it("deve renderizar card completo com todos os componentes", () => {
      render(
        <Card data-testid="full-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Test Content</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>,
      );

      expect(screen.getByTestId("full-card")).toBeInTheDocument();
      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Action" }),
      ).toBeInTheDocument();
    });

    it("deve manter hierarquia correta dos elementos", () => {
      render(
        <Card data-testid="hierarchy-card">
          <CardHeader data-testid="header">
            <CardTitle data-testid="title">Title</CardTitle>
          </CardHeader>
          <CardContent data-testid="content">Content</CardContent>
        </Card>,
      );

      const card = screen.getByTestId("hierarchy-card");
      const header = screen.getByTestId("header");
      const title = screen.getByTestId("title");
      const content = screen.getByTestId("content");

      expect(card).toContainElement(header);
      expect(card).toContainElement(content);
      expect(header).toContainElement(title);
    });
  });

  describe("Casos Extremos", () => {
    it("deve renderizar componentes vazios", () => {
      render(
        <Card data-testid="empty-card">
          <CardHeader />
          <CardContent />
          <CardFooter />
        </Card>,
      );

      expect(screen.getByTestId("empty-card")).toBeInTheDocument();
    });

    it("deve renderizar com JSX complexo como children", () => {
      render(
        <Card>
          <CardContent>
            <div>
              <h2>Complex Content</h2>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </CardContent>
        </Card>,
      );

      expect(screen.getByText("Complex Content")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    it("deve aceitar todas as props HTML div", () => {
      render(
        <Card
          id="test-id"
          role="region"
          aria-label="Test card"
          data-testid="props-card"
        >
          Content
        </Card>,
      );

      const card = screen.getByTestId("props-card");
      expect(card).toHaveAttribute("id", "test-id");
      expect(card).toHaveAttribute("role", "region");
      expect(card).toHaveAttribute("aria-label", "Test card");
    });
  });
});
