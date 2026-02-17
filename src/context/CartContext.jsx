import { createContext, useContext, useState } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const addToCart = (product, selectedSize) => {
    const newItem = {
      ...product,
      selectedSize,
      quantity: 1
    }

    setCart((prev) => [...prev, newItem])
  }

  const cartCount = cart.length

  return (
    <CartContext.Provider
      value={{ cart, addToCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
