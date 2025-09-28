import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils/render';
import userEvent from '@testing-library/user-event';
import { Input } from '../../../components/ui/input';

describe('Input', () => {
  describe('Renderização Básica', () => {
    it('deve renderizar sem crashar', () => {
      render(<Input data-testid="input" />);
      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('deve ter o atributo data-slot correto', () => {
      render(<Input data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('data-slot', 'input');
    });

    it('deve aplicar classes base corretas', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveClass(
        'border-input',
        'flex',
        'h-9',
        'w-full',
        'min-w-0',
        'rounded-md',
        'border',
        'bg-transparent',
        'px-3',
        'py-1',
        'text-base',
        'shadow-xs',
        'outline-none'
      );
    });

    it('deve aceitar className customizada', () => {
      render(<Input className="custom-class" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('custom-class');
    });

    it('deve ser um elemento input', () => {
      render(<Input data-testid="input" />);
      expect(screen.getByTestId('input')).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Tipos de Input', () => {
    it('deve aplicar type text por padrão', () => {
      render(<Input data-testid="input" />);
      // HTML input elements have type="text" by default, but it may not be explicitly set
      const input = screen.getByTestId('input');
      expect(input.getAttribute('type')).toBe(null); // No explicit type means default "text"
      expect(input).toHaveProperty('type', 'text');
    });

    it('deve aceitar type email', () => {
      render(<Input type="email" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');
    });

    it('deve aceitar type password', () => {
      render(<Input type="password" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');
    });

    it('deve aceitar type number', () => {
      render(<Input type="number" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'number');
    });

    it('deve aceitar type tel', () => {
      render(<Input type="tel" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'tel');
    });

    it('deve aceitar type url', () => {
      render(<Input type="url" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'url');
    });

    it('deve aceitar type search', () => {
      render(<Input type="search" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'search');
    });
  });

  describe('Propriedades e Atributos', () => {
    it('deve aceitar placeholder', () => {
      render(<Input placeholder="Digite aqui..." data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('placeholder', 'Digite aqui...');
    });

    it('deve aceitar value', () => {
      render(<Input value="test value" data-testid="input" readOnly />);
      expect(screen.getByTestId('input')).toHaveValue('test value');
    });

    it('deve aceitar defaultValue', () => {
      render(<Input defaultValue="default test" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveValue('default test');
    });

    it('deve aceitar name', () => {
      render(<Input name="test-name" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('name', 'test-name');
    });

    it('deve aceitar id', () => {
      render(<Input id="test-id" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('id', 'test-id');
    });

    it('deve aceitar required', () => {
      render(<Input required data-testid="input" />);
      expect(screen.getByTestId('input')).toBeRequired();
    });

    it('deve aceitar disabled', () => {
      render(<Input disabled data-testid="input" />);
      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('deve aceitar readonly', () => {
      render(<Input readOnly data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('readonly');
    });

    it('deve aceitar maxLength', () => {
      render(<Input maxLength={10} data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('maxLength', '10');
    });

    it('deve aceitar minLength', () => {
      render(<Input minLength={5} data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('minLength', '5');
    });
  });

  describe('Interações do Usuário', () => {
    it('deve responder a mudanças de valor com onChange', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();

      render(<Input onChange={mockHandler} data-testid="input" />);

      await user.type(screen.getByTestId('input'), 'test');
      expect(mockHandler).toHaveBeenCalledTimes(4); // Uma chamada para cada caractere
    });

    it('deve responder a mudanças com fireEvent', () => {
      const mockHandler = vi.fn();

      render(<Input onChange={mockHandler} data-testid="input" />);

      fireEvent.change(screen.getByTestId('input'), { target: { value: 'test' } });
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('deve responder a focus', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();

      render(<Input onFocus={mockHandler} data-testid="input" />);

      await user.click(screen.getByTestId('input'));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('deve responder a blur', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();

      render(
        <div>
          <Input onBlur={mockHandler} data-testid="input" />
          <button>Other element</button>
        </div>
      );

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.click(screen.getByRole('button'));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('deve ser focável via teclado', async () => {
      const user = userEvent.setup();
      render(<Input data-testid="input" />);

      await user.tab();
      expect(screen.getByTestId('input')).toHaveFocus();
    });

    it('deve aceitar entrada de teclado', async () => {
      const user = userEvent.setup();
      render(<Input data-testid="input" />);

      const input = screen.getByTestId('input');
      await user.click(input);
      await user.keyboard('Hello World');
      expect(input).toHaveValue('Hello World');
    });

    it('não deve aceitar mudanças quando disabled', async () => {
      const user = userEvent.setup();
      const mockHandler = vi.fn();

      render(<Input disabled onChange={mockHandler} data-testid="input" />);

      await user.type(screen.getByTestId('input'), 'test');
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('não deve aceitar mudanças quando readonly', async () => {
      const user = userEvent.setup();
      render(<Input readOnly defaultValue="readonly" data-testid="input" />);

      await user.type(screen.getByTestId('input'), 'test');
      expect(screen.getByTestId('input')).toHaveValue('readonly');
    });
  });

  describe('Estados Visuais', () => {
    it('deve mostrar estado disabled com classes corretas', () => {
      render(<Input disabled data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('disabled:pointer-events-none', 'disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('deve ter classes de placeholder corretas', () => {
      render(<Input placeholder="test" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('placeholder:text-muted-foreground');
    });

    it('deve ter classes de selection corretas', () => {
      render(<Input data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('selection:bg-primary', 'selection:text-primary-foreground');
    });

    it('deve ter classes aria-invalid quando inválido', () => {
      render(<Input aria-invalid data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveClass('aria-invalid:ring-destructive/20', 'aria-invalid:border-destructive');
    });
  });

  describe('Acessibilidade', () => {
    it('deve aceitar aria-label', () => {
      render(<Input aria-label="Campo de entrada" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-label', 'Campo de entrada');
    });

    it('deve aceitar aria-describedby', () => {
      render(<Input aria-describedby="help-text" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('deve aceitar aria-invalid', () => {
      render(<Input aria-invalid data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid');
    });

    it('deve aceitar role', () => {
      render(<Input role="textbox" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('role', 'textbox');
    });
  });

  describe('Validação', () => {
    it('deve aceitar pattern para validação', () => {
      render(<Input pattern="[0-9]+" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('pattern', '[0-9]+');
    });

    it('deve aceitar min e max para inputs numéricos', () => {
      render(<Input type="number" min="0" max="100" data-testid="input" />);
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });

    it('deve aceitar step para inputs numéricos', () => {
      render(<Input type="number" step="0.1" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('step', '0.1');
    });
  });

  describe('Casos Extremos', () => {
    it('deve renderizar com todas as props HTML válidas', () => {
      render(
        <Input
          data-testid="input"
          autoComplete="email"
          autoFocus
          tabIndex={1}
          spellCheck={false}
          autoCapitalize="none"
        />
      );

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('autocomplete', 'email');
      expect(input).toHaveAttribute('tabindex', '1');
      expect(input).toHaveAttribute('spellcheck', 'false');
      expect(input).toHaveAttribute('autocapitalize', 'none');
    });

    it('deve lidar com valores extremos', async () => {
      const longValue = 'a'.repeat(100); // Reduced for faster test
      
      render(<Input data-testid="input" defaultValue={longValue} />);

      expect(screen.getByTestId('input')).toHaveValue(longValue);
    });

    it('deve combinar múltiplas classes corretamente', () => {
      render(
        <Input 
          className="border-red-500 text-lg custom-input" 
          data-testid="input" 
        />
      );
      
      const input = screen.getByTestId('input');
      // Check for individual classes rather than exact match due to complex class string
      expect(input).toHaveClass('border-red-500');
      expect(input).toHaveClass('text-lg');
      expect(input).toHaveClass('custom-input');
      expect(input).toHaveClass('border'); // From base classes
    });
  });
});