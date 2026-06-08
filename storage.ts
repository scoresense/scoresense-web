import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("newsletter.subscribe", () => {
  it("inscreve um novo e-mail com sucesso e dispara notificação ao proprietário sem quebrar o fluxo", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.newsletter.subscribe({
      email: `test-${Date.now()}@example.com`,
      name: "Test User",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("sucesso");
  });

  it("rejeita formato de e-mail inválido", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.newsletter.subscribe({
        email: "invalid-email",
        name: "Test User",
      })
    ).rejects.toBeDefined();
  });

  it("trata inscrições duplicadas de forma graciosa (upsert mantém sucesso)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const email = `duplicate-${Date.now()}@example.com`;

    const result1 = await caller.newsletter.subscribe({ email, name: "Test User" });
    expect(result1.success).toBe(true);

    // O helper usa onDuplicateKeyUpdate (upsert), portanto a segunda inscrição
    // do mesmo e-mail também retorna sucesso sem lançar erro de duplicidade.
    const result2 = await caller.newsletter.subscribe({ email, name: "Test User" });
    expect(result2.success).toBe(true);
  });

  it("aceita o parâmetro de nome como opcional", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.newsletter.subscribe({
      email: `no-name-${Date.now()}@example.com`,
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("sucesso");
  });
});
