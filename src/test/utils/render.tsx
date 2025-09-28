import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { vi } from "vitest";

// Wrapper customizado simples para testes
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="test-wrapper">{children}</div>;
};

// Render customizado que inclui o wrapper
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: TestWrapper, ...options });

// Re-exportar tudo do testing-library
export * from "@testing-library/react";

// Sobrescrever render com nossa versão customizada
export { customRender as render };

// Utilitários de teste comuns
export const mockUser = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
};

export const mockFlight = {
  id: "flight-1",
  flight_number: "LA3001",
  airline: "LATAM",
  origin: "CNF",
  destination: "GRU",
  departure_time: "2024-12-15T06:00:00Z",
  arrival_time: "2024-12-15T07:20:00Z",
  price: 800,
  currency: "BRL",
  duration: "01:20",
  stops: 0,
};

export const mockHotel = {
  id: "hotel-1",
  name: "Hotel Test",
  location: "São Paulo",
  rating: 4.5,
  price: 200,
  currency: "BRL",
};

// Mock de funções comuns
export const createMockFunction = () => vi.fn();

// Helper para testes de responsividade
export const setMobileViewport = () => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: 375,
  });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: 667,
  });
};

export const setDesktopViewport = () => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: 1024,
  });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: 768,
  });
};
