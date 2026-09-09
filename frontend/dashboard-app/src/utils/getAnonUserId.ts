// utils/getAnonUserId.ts
export function getAnonUserId(): string {
    let id = localStorage.getItem("anonUserId");
    if (id && !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      id = null;
    }
    if (!id) {
      id = crypto.randomUUID(); // Gera um ID único
      localStorage.setItem("anonUserId", id);
    }
    return id;
  }
