import { useState, useEffect, useRef, FormEvent } from "react";
import { ArrowBigUp, ArrowBigDown, Trash2, DollarSign } from "lucide-react";
import { api } from "./services/api";

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

  const detailsRef = useRef<HTMLInputElement | null>(null);
  const valueRef = useRef<HTMLInputElement | null>(null);

  // useEffect é um hook do React que é executado sempre que o componente é montado ou atualizado
  useEffect(() => {
    loadCustomers(); // aqui chamamos a função que faz a requisição para a API
  }, []);

  // Função para carregar os dados da API
  async function loadCustomers() {
    const response = await api.get("/listCustomers"); // aqui fazemos a requisição para a API
    setCustomers(response.data); // aqui adicionamos os dados no estado setCustomers
  }

  // Função para adicionar uma nova transação
  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); // aqui previnimos que a página recarregue

    if (!detailsRef.current?.value || !valueRef.current?.value || !selected)
      return alert("Preencha todos os campos!"); // aqui verificamos se os campos estão preenchidos

    // Faz a requisição para a API para adicionar uma nova transação
    const response = await api.post("/customer", {
      details: detailsRef?.current.value,
      value: parseFloat(valueRef?.current.value),
      type: selected,
    });

    // Adiciona a nova transação ao estado customers, mantendo as transações anteriores
    setCustomers((allCustomers) => [...allCustomers, response.data]);

    // Limpa os campos de detalhes e valor
    if (detailsRef.current) detailsRef.current.value = "";
    if (valueRef.current) valueRef.current.value = "";
    setSelected(null); // Reseta o tipo de transação selecionado
  }

  async function handleDelete(id: string) {
    try {
      await api.delete("/customer", {
        params: {
          id: id,
        },
      });

      // Vai devolver todos os items que não tem o id que foi passado para deletar
      const allCustomers = customers.filter((customer) => customer.id !== id); // aqui filtramos os dados para remover o item que foi deletado
      setCustomers(allCustomers); // aqui atualizamos o estado customers
    } catch (error) {
      console.log(error);
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

  return (
    <div className="text-gray-800 max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-semibold text-center text-white mb-12">
        Gestão Financeira
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        {/* saldo total */}
        <div className="md:col-span-12 bg-white rounded-2xl p-8 shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
          <div className="bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-gray-800 font-bold">Saldo Total</h2>
              <DollarSign className="text-green-500 w-8 h-8" />
            </div>
            <p className=" text-4xl">
              R$ <span className="text-green-400">{saldoTotal.toFixed(2)}</span>{" "}
            </p>
          </div>
        </div>

        {/* Entradas */}
        <div className="md:col-span-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 h-full">
            <div className="flex flex-col items-start justify-between mb-3">
              <div className="flex items-center justify-between w-full">
                <div className="text-xl font-semibold text-green-500">
                  Entradas
                </div>
                <ArrowBigUp className="text-green-500 w-8 h-8" />
              </div>
              <p className="text-3xl text-gray-900 font-bold">
                R$ {totalEntradas.toFixed(2)}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                Total de receitas
              </div>
            </div>
          </div>
        </div>

        {/* Saidas */}
        <div className="md:col-span-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 h-full">
            <div className="flex flex-col items-start justify-between mb-3">
              <div className="flex items-center justify-between w-full">
                <div className="text-xl font-semibold text-red-500">Saídas</div>
                <ArrowBigDown className="text-red-500 w-8 h-8" />
              </div>
              <p className="text-3xl text-gray-900 font-bold">
                R$ {totalSaidas.toFixed(2)}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                Total de despesas
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Formulário */}
        <form
          className="bg-white w-full rounded-2xl p-6 shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* Campo de detalhes */}
            <input
              type="text"
              maxLength={20}
              placeholder="Detalhes..."
              className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-700 transition-all duration-300"
              ref={detailsRef}
            />

            {/* Campo Valor */}
            <input
              type="number"
              placeholder="Valor R$"
              className="md:col-span-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring focus:ring-indigo-700 transition-all duration-300"
              ref={valueRef}
            />

            {/* Botões Entrada e Saída */}
            <div className="md:col-span-2 flex items-center gap-5">
              <button
                type="button"
                onClick={() => setSelected("entrada")}
                className={`flex items-center justify-center px-4 py-2 text-gray-500 font-semibold rounded-lg transition
                ${
                  selected === "entrada"
                    ? "bg-green-500 text-white transition-transform duration-300 scale-105"
                    : "bg-gray-100 hover:bg-gray-200 transform duration-300"
                }
                
                `}
              >
                <ArrowBigUp />
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setSelected("saida")}
                className={`flex items-center justify-center px-4 py-2 gap-1 text-gray-500 font-semibold rounded-lg shadow transition ${
                  selected === "saida"
                    ? "bg-red-500 text-white transition-transform duration-300 scale-105"
                    : "bg-gray-100 hover:bg-gray-200 transform duration-300"
                }`}
              >
                <ArrowBigDown />
                Saída
              </button>
            </div>
          </div>

          {/* Botão Adicionar */}
          <input
            type="submit"
            value="Adicionar Transação"
            className="w-full px-4 py-3 bg-indigo-700 text-white font-bold rounded-lg hover:bg-indigo-900 transition"
          ></input>
        </form>

        {/* Tabela de ebição de dados */}
        <div className="bg-white w-full mt-6 rounded-lg p-6 gap-10 shadow-lg">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b border-gray-200 text-gray-700">
                <th className="pb-2 p-2">Detalhes</th>
                <th className="pb-2">Valor</th>
                <th className="pb-2">Tipo</th>
                <th className="pb-2">Ações</th>
              </tr>
            </thead>
            <tbody className="text-stone-900">
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-200 rounded-4xl transition-transform duration-300"
                >
                  <td className="py-2 p-3"> {customer.details} </td>
                  <td className="py-2 P-1"> R$ {customer.value.toFixed(2)} </td>
                  <td
                    className={`py-2 mt-2 text-sm font-medium text-green-800 bg-green-100 rounded-full inline-block px-2 ${
                      customer.type === "saida"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-grenn-800"
                    }`}
                  >
                    {customer.type}
                  </td>

                  <td className="py-2">
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleDelete(customer.id)}
                    >
                      <Trash2 className="hover:scale-110" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
