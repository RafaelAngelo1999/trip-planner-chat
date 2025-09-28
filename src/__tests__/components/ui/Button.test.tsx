import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils/render';
import userEvent from '@testing-library/user-event';
import { Button } from '../../../components/ui/button';

describe('Button', () => {
  const defaultProps = {
    children: 'Click me',
  };

  describe('Renderização Básica', () => {
    it('deve renderizar sem crashar', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('deve exibir o texto do children', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('deve ter o atributo data-slot', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'button');
    });

    it('deve aplicar className customizada', () => {
      render(<Button className="custom-class" {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  describe('Variantes', () => {
    it('deve aplicar variante default por padrão', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
    });

    it('deve aplicar variante destructive', () => {
      render(<Button variant="destructive" {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive', 'text-white');
    });

    it('deve aplicar variante outline', () => {
      render(<Button variant="outline" {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'border-input', 'bg-background');
    });

    it('deve aplicar variante secondary', () => {
      render(<Button variant="secondary" {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    it('deve aplicar variante ghost', () => {
      render(<Button variant="ghost" {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground');
    });

    it('deve aplicar variante link', () => {
      render(<Button variant="link" {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-primary', 'underline-offset-4');
    });

    it('deve aplicar variante brand', () => {
      render(<Button variant="brand" {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-[#2F6868]', 'text-white');
    });
  });

  describe('Tamanhos', () => {
    it('deve aplicar tamanho default por padrão', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9', 'px-4', 'py-2');
    });

    it('deve aplicar tamanho sm', () => {
      render(<Button size="sm" {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8', 'px-3');
    });

    it('deve aplicar tamanho lg', () => {
      render(<Button size="lg" {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'px-6');
    });

    it('deve aplicar tamanho icon', () => {
      render(<Button size="icon" {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('size-9');
    });
  });

  describe('Interações do Usuário', () => {
    it('deve responder a clicks', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();

      render(<Button onClick={mockHandler} {...defaultProps} />);

      await user.click(screen.getByRole('button'));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('deve responder a clicks com fireEvent', () => {
      const mockHandler = vi.fn();

      render(<Button onClick={mockHandler} {...defaultProps} />);

      fireEvent.click(screen.getByRole('button'));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar onClick quando disabled', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();

      render(<Button onClick={mockHandler} disabled {...defaultProps} />);

      await user.click(screen.getByRole('button'));
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('deve ser focável via teclado', async () => {
      const user = userEvent.setup();
      render(<Button {...defaultProps} />);

      const button = screen.getByRole('button');
      await user.tab();
      expect(button).toHaveFocus();
    });

    it('deve ativar com Enter', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();

      render(<Button onClick={mockHandler} {...defaultProps} />);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('deve ativar com Space', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();

      render(<Button onClick={mockHandler} {...defaultProps} />);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Estados Visuais', () => {
    it('deve mostrar estado disabled', () => {
      render(<Button disabled {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:pointer-events-none');
    });

    it('deve aceitar type submit', () => {
      render(<Button type="submit" {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('deve aceitar type button', () => {
      render(<Button type="button" {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });
  });

  describe('Propriedades HTML', () => {
    it('deve aceitar aria-label', () => {
      render(<Button aria-label="Custom label" {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom label');
    });

    it('deve aceitar data attributes', () => {
      render(<Button data-testid="custom-button" {...defaultProps} />);
      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });

    it('deve aceitar id', () => {
      render(<Button id="custom-id" {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Classes CSS e Estilização', () => {
    it('deve ter classes base corretas', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'gap-2',
        'whitespace-nowrap',
        'rounded-md',
        'text-sm',
        'font-medium',
        'transition-[color,box-shadow]'
      );
    });

    it('deve ter classes de focus corretas', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'outline-none',
        'focus-visible:border-ring',
        'focus-visible:ring-ring/50',
        'focus-visible:ring-[3px]'
      );
    });

    it('deve combinar múltiplas classes corretamente', () => {
      render(
        <Button 
          variant="outline" 
          size="lg" 
          className="custom-class" 
          {...defaultProps} 
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'h-10', 'custom-class');
    });
  });

  describe('Casos Extremos', () => {
    it('deve renderizar sem children', () => {
      render(<Button />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('deve renderizar com children null', () => {
      render(<Button>{null}</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('deve renderizar com múltiplos children', () => {
      render(
        <Button>
          <span>Icon</span>
          Text
        </Button>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('deve renderizar com JSX como children', () => {
      render(
        <Button>
          <div data-testid="custom-content">Custom Content</div>
        </Button>
      );
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });
  });
});