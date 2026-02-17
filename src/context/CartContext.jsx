import { createContext, useContext, useState } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // ✅ Add to Cart
  const addToCart = (product, selectedSize) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize
      )

      // If same product + size exists → increase quantity
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      // Otherwise add new item
      return [
        ...prev,
        { ...product, selectedSize, quantity: 1 }
      ]
    })
  }

  // ✅ Remove from Cart
  const removeFromCart = (id, size) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.id === id && item.selectedSize === size)
      )
    )
  }

  // ✅ Update Quantity
  const updateQuantity = (id, size, amount) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedSize === size
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + amount)
            }
          : item
      )
    )
  }

  // ✅ Cart Count (total quantity, not just items)
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // ✅ Subtotal
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
