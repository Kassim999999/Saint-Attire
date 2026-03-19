import { createContext, useContext, useState , useEffect} from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
const [cart, setCart] = useState([])

useEffect(() => {
  const savedCart = localStorage.getItem("fly-cart")

  if (savedCart) {
    setCart(JSON.parse(savedCart))
  }
}, [])


  // ✅ Add to Cart
const addToCart = (product, selectedSize) => {
  setCart((prev) => {
    const existingItem = prev.find(
      (item) =>
        item.id === product.id &&
        item.selectedSize === selectedSize
    )

    // If already in cart
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        return prev // stop if max stock reached
      }

      return prev.map((item) =>
        item.id === product.id &&
        item.selectedSize === selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    }

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
    prev.map((item) => {
      if (item.id === id && item.selectedSize === size) {
        const newQty = item.quantity + amount

        if (newQty < 1) return item
        if (newQty > item.stock) return item

        return { ...item, quantity: newQty }
      }
      return item
    })
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

  useEffect(() => {
  localStorage.setItem("fly-cart", JSON.stringify(cart))
}, [cart])

useEffect(() => {
  const syncCart = async () => {
    const res = await fetch("http://127.0.0.1:8000/products")
    const products = await res.json()

    setCart((prevCart) =>
      prevCart.map((item) => {
        const updatedProduct = products.find(p => p.id === item.id)

        if (!updatedProduct) return item

        return {
          ...item,
          price: updatedProduct.price,
          name: updatedProduct.name,
          image: updatedProduct.image,
          stock: updatedProduct.stock
        }
      })
    )
  }

  syncCart()
}, [])


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
