// utils/getAnonUserId.ts
export function getAnonUserId(): string {
    let id = localStorage.getItem("anonUserId");
    if (!id) {
      id = crypto.randomUUID(); // Gera um ID único
      localStorage.setItem("anonUserId", id);
    }
    return id;
  }