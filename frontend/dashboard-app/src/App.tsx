import { useState, useEffect, useRef, FormEvent } from "react";
import {
  ArrowBigUp,
  ArrowBigDown,
  Trash2,
  DollarSign,
  Loader2,
} from "lucide-react";
import { api } from "./services/api";
import { ToastContainer, toast, Flip } from "react-toastify";
import { getAnonUserId } from "./utils/getAnonUserId";
import { ModalDelete } from "./ModalDelete";

interface CustomerProps {
  id: string;
  details: string;
  value: number;
  type: string;
  created_at: string;
} // aqui cria uma interface para tipar os dados que vamos receber da API

export function App() {
  const [selected, setSelected] = useState<"entrada" | "saida" | null>(null); // aqui criamos um estado para arm azernar o tipo de transação que o usuário selecionou

  const [customers, setCustomers] = useState<CustomerProps[]>([]); // aqui criamos um estado para armazenar os dados da API
  // em <CustomerProps[]> estamos dizendo que o estado customers é um array de objetos do tipo CustomerProps
  const [loading, setLoading] = useState(false);
  const detailsRef = useRef<HTMLInputElement | null>(null);
  const valueRef = useRef<HTMLInputElement | null>(null);
  // Estados para controle do modal de exclusão
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    details: string;
  } | null>(null);

  // useEffect é um hook do React que é executado sempre que o componente é montado ou atualizado
  useEffect(() => {
    loadCustomers(); // aqui chamamos a função que faz a requisição para a API
  }, []);

  // Função para carregar os dados da API
  async function loadCustomers() {
    const anonUserId = getAnonUserId();

    const response = await api.get("/listCustomers", {
      params: { anonUserId },
    });

    setCustomers(response.data);
  }

  // Função para adicionar uma nova transação
  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); // aqui previnimos que a página recarregue

    if (!detailsRef.current?.value || !valueRef.current?.value || !selected)
      return toast.error("Preencha todos os campos!", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      }); // aqui verificamos se os campos estão preenchidos

    try {
      setLoading(true); // COMEÇA O LOADING
      const anonUserId = getAnonUserId(); // Pega o ID do usuário aqui
      // Faz a requisição para a API para adicionar uma nova transação
      const response = await api.post("/customer", {
        details: detailsRef?.current.value,
        value: parseFloat(valueRef?.current.value),
        type: selected,
        anonUserId, // Envia o `anonUserId` na requisição
      });

      // Adiciona a nova transação ao estado customers, mantendo as transações anteriores
      setCustomers((allCustomers) => [...allCustomers, response.data]);

      // Limpa os campos de detalhes e valor
      if (detailsRef.current) detailsRef.current.value = "";
      if (valueRef.current) valueRef.current.value = "";
      setSelected(null); // Reseta o tipo de transação selecionado

      // Exibe uma mensagem de sucesso
      toast.success("Transação adicionada com sucesso!", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
    } catch (error) {
      // Exibe uma mensagem de erro em caso de falha na requisição
      toast.error(
        "Erro ao adicionar a transação. Tente novamente mais tarde!",
        {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Flip,
        },
      );
      console.error("Erro ao adicionar transação:", error);
    } finally {
      setLoading(false); // TERMINA O LOADING
    }
  }

  // Deletar uma transação
  // 1. Função apenas para abrir o modal e salvar qual item será deletado
  function handleOpenDeleteModal(id: string, details: string) {
    setItemToDelete({ id, details });
    setIsModalOpen(true);
  }

  // 2. Função que REALMENTE deleta (chamada pelo botão "Excluir" do Modal)
  async function confirmDeletion() {
    if (!itemToDelete) return;

    try {
      const anonUserId = getAnonUserId();

      await api.delete(`/customer/${itemToDelete.id}`, {
        params: { anonUserId },
      });

      // Remove do estado local
      const allCustomers = customers.filter(
        (customer) => customer.id !== itemToDelete.id,
      );
      setCustomers(allCustomers);

      toast.success("Transação excluída com sucesso!", {
        position: "bottom-right",
        autoClose: 1000,
        pauseOnHover: false,
        theme: "dark",
        transition: Flip,
      });
    } catch (error) {
      toast.error(
        "Erro ao tentar excluir a transação. Tente novamente mais tarde!",
        {
          position: "bottom-right",
          autoClose: 1000,
          pauseOnHover: false,
          theme: "dark",
          transition: Flip,
        },
      );
      console.error("Erro ao deletar:", error);
    } finally {
      // Fecha o modal e limpa o estado independente de sucesso ou erro
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  }

  // Aqui calculamos o total de entradas
  const totalEntradas = customers
    .filter((customer) => customer.type === "entrada") // aqui filtramos os dados para pegar apenas as entradas
    .reduce((acc, customer) => acc + customer.value, 0); // aqui somamos o valor de todas as entradas

  // Aqui calculamos o total de saídas
  const totalSaidas = customers
    .filter((customer) => customer.type === "saida") // aqui filtramos os dados para pegar apenas as saídas
    .reduce((acc, customer) => acc + customer.value, 0); // aqui somamos o valor de todas as saídas

  const saldoTotal = totalEntradas - totalSaidas; // aqui calculamos o saldo total

  //Validação dos valores de entrada
  const handleChange = () => {
    if (!valueRef.current) return;

    // Remove caracteres que não são números ou ponto
    let inputValue = valueRef.current.value.replace(/[^0-9.,]/g, "");

    // Limita número de caracteres
    inputValue = inputValue.slice(0, 12);

    // Garante que há apenas um ponto decimal e que ele não está no início
    const parts = inputValue.split(/[.,]/);
    if (parts.length > 2) {
      valueRef.current.value = parts[0] + "." + parts.slice(1).join(""); // Mantém apenas o primeiro ponto
      return;
    }

    // Limita casas decimais
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2); // limitando casas decimais em 2
    }

    const formattedValue = parts.join(".");

    // Atualiza o valor diretamente no ref
    if (valueRef.current) {
      valueRef.current.value = formattedValue;
    }

    return;
  };

  const FormatCurrencyBlur = () => {
    if (!valueRef.current) {
      toast.error("Preencha o campo valor!", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
      return;
    }

    // transformando string em numero float e substituindo virgula por ponto
    const numericValue = parseFloat(valueRef.current.value.replace(",", "."));

    // permite apenas valores acima de 0
    if (isNaN(numericValue) || numericValue <= 0) {
      toast.error("Digite um valor válido acima de 0!", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
      valueRef.current.value = "";
    }
  };

  // Função para formatar a data de forma relativa (Hoje, Ontem ou data formatada)
  const formatRelativeDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();

    // Zeramos as horas para comparar apenas os dias
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const compareDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    if (compareDate.getTime() === today.getTime()) {
      return "Hoje";
    } else if (compareDate.getTime() === yesterday.getTime()) {
      return "Ontem";
    } else {
      // Se for mais antigo, mostra a data formatada (ex: 08 mar.)
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      });
    }
  };

  return (
    <div className="text-gray-800 max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Organize suas{" "}
          <span className=" bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Finanças
          </span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Monitore seus gastos com uma interface intuitiva.
        </p>
        {/* Detalhe visual: uma linha sutil abaixo do texto */}
        <div className="w-12 h-1 bg-emerald-500 mx-auto rounded-full mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* saldo total */}
        <div className="md:col-span-12 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-10 shadow-2xl transform hover:scale-[1.01] transition-all duration-300 group overflow-hidden relative">
          <div
            className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 transition-colors duration-500 ${
              saldoTotal < 0 ? "bg-rose-500" : "bg-emerald-500"
            }`}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">
                  Balanço Geral
                </span>
                <h2 className="text-2xl text-white font-black mt-1">
                  Saldo Total
                </h2>
              </div>
              <div
                className={`p-3 rounded-2xl transition-colors ${
                  saldoTotal < 0 ? "bg-rose-500/10" : "bg-emerald-500/10"
                }`}
              >
                <DollarSign
                  className={`w-8 h-8 ${
                    saldoTotal < 0 ? "text-rose-500" : "text-emerald-500"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <p
                className={`text-6xl font-black tracking-tighter transition-colors duration-500 ${
                  saldoTotal < 0 ? "text-rose-500" : "text-emerald-400"
                }`}
              >
                {saldoTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>

            {/* Uma linha de progresso */}
            <div className="w-full h-[2px] bg-zinc-800 mt-8 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  saldoTotal < 0 ? "bg-rose-500 w-1/3" : "bg-emerald-500 w-full"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Entradas */}
        <div className="md:col-span-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 hover:border-emerald-500/50 transition-all duration-300 group transform hover:scale-105 shadow-lg cursor-pointer">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">
                  Entradas
                </span>
                <div className="bg-emerald-500/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <ArrowBigUp className="text-emerald-500 w-6 h-6" />
                </div>
              </div>

              <div>
                <p className="text-4xl text-white font-black tracking-tighter">
                  {totalEntradas.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <div className="mt-1 text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
                  Total de receitas
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saidas */}
        <div className="md:col-span-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 hover:border-rose-500/50 transition-all duration-300 group shadow-lg transform hover:scale-105 cursor-pointer">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">
                  Saídas
                </span>
                <div className="bg-rose-500/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <ArrowBigDown className="text-rose-500 w-6 h-6" />
                </div>
              </div>

              <div>
                <p className="text-4xl text-white font-black tracking-tighter">
                  {totalSaidas.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <div className="mt-1 text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
                  Total de despesas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full max-w-5xl mx-auto">
        <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mb-6">
          Monitoramento em Tempo Real
        </h2>

        {/* Formulário */}
        <form
          className="bg-zinc-900/50 border border-zinc-800 w-full rounded-[2rem] p-8 shadow-2xl backdrop-blur-sm"
          onSubmit={handleSubmit}
        >
          {/* Aviso Sutil em vez do Amarelão */}
          <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 text-emerald-500/80 text-xs rounded-xl p-4 mb-8 justify-center tracking-wide">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>
              Sincronizando com o servidor... (Pode demorar alguns segundos na
              primeira vez)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {/* Inputs com estilo 'Focus Glow' */}
            <input
              type="text"
              maxLength={20}
              placeholder="O que você comprou/recebeu?"
              className="md:col-span-2 bg-black/40 border border-zinc-800 px-5 py-3 rounded-2xl outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 text-white transition-all placeholder:text-zinc-600"
              ref={detailsRef}
            />

            <input
              type="text"
              pattern="^\d+([.,]\d{1,2})?$"
              placeholder="R$ 0,00"
              className="md:col-span-1 bg-black/40 border border-zinc-800 px-5 py-3 rounded-2xl outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 text-white transition-all placeholder:text-zinc-600"
              ref={valueRef}
              onChange={handleChange}
              onBlur={FormatCurrencyBlur}
            />

            {/* Botões de Seleção */}
            <div className="md:col-span-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelected("entrada")}
                className={`flex-1 cursor-pointer hover:scale-105 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all ${
                  selected === "entrada"
                    ? "bg-emerald-500 text-black scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    : "bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800"
                }`}
              >
                <ArrowBigUp className="w-5 h-5" />
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setSelected("saida")}
                className={`flex-1 cursor-pointer hover:scale-105 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all ${
                  selected === "saida"
                    ? "bg-rose-500 text-white scale-105 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                    : "bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800"
                }`}
              >
                <ArrowBigDown className="w-5 h-5" />
                Saída
              </button>
            </div>
          </div>

          {/* Botão Adicionar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(16,185,129,0.2)]
               duration-300 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Confirmar Lançamento"
            )}
          </button>
        </form>

        {/* Lista de Transações */}
        <div className="w-full mt-12 space-y-4">
          <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
            Últimas Movimentações
          </h3>

          <div className="grid gap-3">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="bg-zinc-900/40 border border-zinc-800/50 p-5 rounded-2xl flex items-center justify-between group hover:bg-zinc-800/50 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`p-3 rounded-xl ${
                      customer.type === "saida"
                        ? "bg-rose-500/10 text-rose-500"
                        : "bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    {customer.type === "saida" ? (
                      <ArrowBigDown size={20} />
                    ) : (
                      <ArrowBigUp size={20} />
                    )}
                  </div>
                  <div>
                    <div>
                      <p className="text-white font-semibold">
                        {customer.details}
                      </p>
                      <p className="text-zinc-500 text-[10px] uppercase tracking-wider">
                        {formatRelativeDate(customer.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <p
                    className={`text-lg font-bold ${
                      customer.type === "saida"
                        ? "text-rose-500/60"
                        : "text-emerald-400"
                    }`}
                  >
                    {customer.type === "saida" ? "-" : "+"}{" "}
                    {customer.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <button
                    type="button"
                    className="text-zinc-600 hover:text-rose-500 transition-colors p-2"
                    onClick={() =>
                      handleOpenDeleteModal(customer.id, customer.details)
                    }
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ToastContainer />
        <ModalDelete
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDeletion}
          title={itemToDelete?.details || ""}
        />
      </div>
    </div>
  );
}
