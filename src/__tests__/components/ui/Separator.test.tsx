import { render, screen } from '@/test/utils/render';
import { Separator } from '@/components/ui/separator';
import { describe, it, expect } from 'vitest';

describe('Separator Component', () => {
  describe('Renderização Básica', () => {
    it('deve renderizar sem crashar', () => {
      render(<Separator data-testid="separator" />);
      expect(screen.getByTestId('separator')).toBeInTheDocument();
    });

    it('deve renderizar como elemento div por padrão', () => {
      render(<Separator data-testid="separator" />);
      const element = screen.getByTestId('separator');
      expect(element.tagName).toBe('DIV');
    });

    it('deve ter role none por padrão (decorative)', () => {
      render(<Separator data-testid="separator" />);
      const separator = screen.getByTestId('separator');
      expect(separator).toHaveAttribute('role', 'none');
    });

    it('deve aplicar classes CSS corretas para separador horizontal', () => {
      render(<Separator data-testid="horizontal-separator" />);
      const separator = screen.getByTestId('horizontal-separator');
      expect(separator).toHaveClass('shrink-0', 'bg-border');
      expect(separator).toHaveClass('data-[orientation=horizontal]:h-px');
      expect(separator).toHaveClass('data-[orientation=horizontal]:w-full');
    });

    it('deve aplicar classes CSS corretas para separador vertical', () => {
      render(<Separator orientation="vertical" data-testid="vertical-separator" />);
      const separator = screen.getByTestId('vertical-separator');
      expect(separator).toHaveClass('shrink-0', 'bg-border');
      expect(separator).toHaveClass('data-[orientation=vertical]:w-px');
      expect(separator).toHaveClass('data-[orientation=vertical]:h-full');
    });
  });

  describe('Orientação', () => {
    it('deve usar orientação horizontal por padrão', () => {
      render(<Separator data-testid="default-separator" />);
      const separator = screen.getByTestId('default-separator');
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('deve aceitar orientação vertical', () => {
      render(<Separator orientation="vertical" data-testid="vertical-separator" />);
      const separator = screen.getByTestId('vertical-separator');
      expect(separator).toHaveAttribute('data-orientation', 'vertical');
    });

    it('deve aceitar orientação horizontal explícita', () => {
      render(<Separator orientation="horizontal" data-testid="horizontal-separator" />);
      const separator = screen.getByTestId('horizontal-separator');
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });
  });

  describe('Props HTML', () => {
    it('deve aceitar className personalizada', () => {
      render(
        <Separator 
          className="custom-separator bg-red-500" 
          data-testid="custom-separator" 
        />
      );
      const separator = screen.getByTestId('custom-separator');
      expect(separator).toHaveClass('custom-separator', 'bg-red-500');
    });

    it('deve combinar classes padrão com classes personalizadas', () => {
      render(
        <Separator 
          className="border-2 border-blue-500" 
          data-testid="combined-separator" 
        />
      );
      const separator = screen.getByTestId('combined-separator');
      expect(separator).toHaveClass('shrink-0', 'bg-border', 'border-2', 'border-blue-500');
    });

    it('deve aceitar todas as props HTML padrão', () => {
      render(
        <Separator
          id="separator-id"
          title="Separator tooltip"
          data-custom="custom-value"
          data-testid="props-separator"
        />
      );
      const separator = screen.getByTestId('props-separator');
      expect(separator).toHaveAttribute('id', 'separator-id');
      expect(separator).toHaveAttribute('title', 'Separator tooltip');
      expect(separator).toHaveAttribute('data-custom', 'custom-value');
    });

    it('deve aceitar aria attributes personalizados', () => {
      render(
        <Separator
          aria-label="Custom separator"
          aria-hidden="false"
          data-testid="aria-separator"
        />
      );
      const separator = screen.getByTestId('aria-separator');
      expect(separator).toHaveAttribute('aria-label', 'Custom separator');
      expect(separator).toHaveAttribute('aria-hidden', 'false');
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter role none quando decorative (padrão)', () => {
      render(<Separator data-testid="accessible-separator" />);
      const separator = screen.getByTestId('accessible-separator');
      expect(separator).toHaveAttribute('role', 'none');
    });

    it('deve ter data-orientation correto por padrão', () => {
      render(<Separator data-testid="default-orientation" />);
      const separator = screen.getByTestId('default-orientation');
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('deve ter data-orientation correto para vertical', () => {
      render(<Separator orientation="vertical" data-testid="vertical-orientation" />);
      const separator = screen.getByTestId('vertical-orientation');
      expect(separator).toHaveAttribute('data-orientation', 'vertical');
    });

    it('deve ser reconhecido quando não decorativo', () => {
      render(<Separator decorative={false} aria-label="Section divider" />);
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });
  });

  describe('Diferentes Contextos de Uso', () => {
    it('deve funcionar como separador de menu', () => {
      render(
        <div role="menu">
          <div role="menuitem">Item 1</div>
          <Separator data-testid="menu-separator" />
          <div role="menuitem">Item 2</div>
        </div>
      );
      expect(screen.getByTestId('menu-separator')).toBeInTheDocument();
    });

    it('deve funcionar em layouts flexbox', () => {
      render(
        <div className="flex items-center">
          <span>Left</span>
          <Separator orientation="vertical" className="mx-2" data-testid="flex-separator" />
          <span>Right</span>
        </div>
      );
      const separator = screen.getByTestId('flex-separator');
      expect(separator).toHaveClass('mx-2');
    });

    it('deve funcionar em grids', () => {
      render(
        <div className="grid grid-cols-1 gap-4">
          <div>Section 1</div>
          <Separator data-testid="grid-separator" />
          <div>Section 2</div>
        </div>
      );
      expect(screen.getByTestId('grid-separator')).toBeInTheDocument();
    });

    it('deve funcionar como separador de página', () => {
      render(
        <article>
          <section>Content 1</section>
          <Separator className="my-8" data-testid="page-separator" />
          <section>Content 2</section>
        </article>
      );
      const separator = screen.getByTestId('page-separator');
      expect(separator).toHaveClass('my-8');
    });
  });

  describe('Estilos e Aparência', () => {
    it('deve aceitar cores personalizadas', () => {
      render(
        <Separator 
          className="bg-gradient-to-r from-blue-500 to-purple-500" 
          data-testid="gradient-separator" 
        />
      );
      const separator = screen.getByTestId('gradient-separator');
      expect(separator).toHaveClass('bg-gradient-to-r', 'from-blue-500', 'to-purple-500');
    });

    it('deve aceitar espessuras personalizadas', () => {
      render(
        <Separator 
          className="h-2" 
          data-testid="thick-separator" 
        />
      );
      const separator = screen.getByTestId('thick-separator');
      expect(separator).toHaveClass('h-2');
    });

    it('deve aceitar opacidade personalizada', () => {
      render(
        <Separator 
          className="opacity-30" 
          data-testid="transparent-separator" 
        />
      );
      const separator = screen.getByTestId('transparent-separator');
      expect(separator).toHaveClass('opacity-30');
    });

    it('debe aceitar bordas decorativas', () => {
      render(
        <Separator 
          className="border-t-2 border-dashed border-gray-300 bg-transparent h-0" 
          data-testid="dashed-separator" 
        />
      );
      const separator = screen.getByTestId('dashed-separator');
      expect(separator).toHaveClass('border-t-2', 'border-dashed', 'border-gray-300');
    });
  });

  describe('Casos Extremos', () => {
    it('deve renderizar sem props', () => {
      render(<Separator data-testid="minimal-separator" />);
      const separator = screen.getByTestId('minimal-separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('role', 'none');
    });

    it('deve aceitar ref', () => {
      const ref = { current: null };
      render(<Separator ref={ref} data-testid="ref-separator" />);
      expect(screen.getByTestId('ref-separator')).toBeInTheDocument();
    });

    it('deve funcionar com múltiplos separadores', () => {
      render(
        <div>
          <Separator data-testid="sep-1" />
          <Separator orientation="vertical" data-testid="sep-2" />
          <Separator className="bg-red-500" data-testid="sep-3" />
        </div>
      );
      expect(screen.getByTestId('sep-1')).toBeInTheDocument();
      expect(screen.getByTestId('sep-2')).toBeInTheDocument();
      expect(screen.getByTestId('sep-3')).toBeInTheDocument();
    });

    it('deve manter consistência com orientações inválidas', () => {
      // @ts-expect-error - testando comportamento com valor inválido
      render(<Separator orientation="invalid" data-testid="invalid-separator" />);
      const separator = screen.getByTestId('invalid-separator');
      // Deve fallback para horizontal
      expect(separator).toBeInTheDocument();
    });
  });

  describe('Responsividade', () => {
    it('deve aceitar classes responsivas', () => {
      render(
        <Separator 
          className="h-px md:h-0.5 lg:h-1" 
          data-testid="responsive-separator" 
        />
      );
      const separator = screen.getByTestId('responsive-separator');
      expect(separator).toHaveClass('h-px', 'md:h-0.5', 'lg:h-1');
    });

    it('deve funcionar com breakpoints personalizados', () => {
      render(
        <Separator 
          className="hidden sm:block" 
          data-testid="conditional-separator" 
        />
      );
      const separator = screen.getByTestId('conditional-separator');
      expect(separator).toHaveClass('hidden', 'sm:block');
    });
  });
});