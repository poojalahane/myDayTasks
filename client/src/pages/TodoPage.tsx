import React, { useState } from "react";
import { useTodos } from "../context/TodoContext";

const categories = [
  { id: "work", name: "Work", icon: "💼", color: "bg-blue-100 text-blue-800" },
  {
    id: "personal",
    name: "Personal",
    icon: "👤",
    color: "bg-purple-100 text-purple-800",
  },

  {
    id: "health",
    name: "Health",
    icon: "🏥",
    color: "bg-red-100 text-red-800",
  },
  {
    id: "other",
    name: "Other",
    icon: "📌",
    color: "bg-gray-100 text-gray-800",
  },
];

const TodoPage = () => {
  const [newTodo, setNewTodo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();

  const handleAdd = () => {
    if (newTodo.trim() && selectedCategory) {
      addTodo(newTodo.trim(), selectedCategory);
      setNewTodo("");
      setSelectedCategory("");
    }
  };

  const filteredTodos = activeFilter
    ? todos.filter((todo) => todo.category === activeFilter)
    : todos;

  const clearFilters = () => {
    setActiveFilter(null);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        My Todos
      </h2>

      {/* Category Filter Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-700">
            Filter by Category
          </h3>
          {activeFilter && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Clear filter
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setActiveFilter(
                  activeFilter === category.id ? null : category.id
                )
              }
              className={`flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                activeFilter === category.id
                  ? `${category.color} ring-2 ring-offset-2 ring-${
                      category.color.split("-")[1]
                    }-300`
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add Todo Form with Dropdown */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex gap-2">
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
            placeholder="Add a new task"
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            disabled={!newTodo.trim() || !selectedCategory}
            className={`px-6 py-3 rounded-lg font-medium ${
              !newTodo.trim() || !selectedCategory
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            Add
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className={`w-full text-black p-2 border rounded-lg text-left flex items-center justify-between ${
              selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.color
                : "bg-gray-100"
            }`}
          >
            {selectedCategory ? (
              <span className="flex items-center">
                {categories.find((c) => c.id === selectedCategory)?.icon}
                <span className="ml-2 text-black">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
              </span>
            ) : (
              "Select a category"
            )}
            <span>▼</span>
          </button>

          {showCategoryDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShowCategoryDropdown(false);
                  }}
                  className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center ${category.color}`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Todo List  */}
      {filteredTodos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {activeFilter
            ? `No todos in ${
                categories.find((c) => c.id === activeFilter)?.name ||
                "this category"
              }`
            : "No todos yet. Add one to get started!"}
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredTodos.map((todo) => {
            const category =
              categories.find((cat) => cat.id === todo.category) ||
              categories.find((cat) => cat.id === "other");

            return (
              <li
                key={todo.id}
                className={`flex items-center justify-between p-4 rounded-lg shadow-sm border ${
                  todo.completed ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`${category.color} p-2 rounded-full`}
                    title={category.name}
                  >
                    {category.icon}
                  </span>
                  <div className="flex flex-col">
                    <div
                      className={`cursor-pointer ${
                        todo.completed
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                      onClick={() => toggleTodo(todo.id)}
                    >
                      {todo.title}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${category.color} w-fit mt-1`}
                    >
                      {category.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                  title="Delete todo"
                >
                  ❌
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TodoPage;
