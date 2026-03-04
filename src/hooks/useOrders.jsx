// =============================================
// useOrders Hook - Gestión de pedidos
// =============================================
import { useState, useEffect, useCallback } from 'react'
import api from '../lib/axios'

// Almacén mock de pedidos (persiste en memoria)
let mockOrders = []

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/orders')
      setOrders(res.data)
    } catch {
      // Fallback a mock
      setOrders(mockOrders)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Crear pedido
  const createOrder = async (items, total, addressId = null, paymentMethodId = null) => {
    try {
      const res = await api.post('/api/orders', {
        items, total, address_id: addressId, payment_method_id: paymentMethodId
      })
      const newOrder = res.data
      setOrders(prev => [newOrder, ...prev])
      return { success: true, order: newOrder }
    } catch {
      // Mock fallback
      const newOrder = {
        id: mockOrders.length + 1,
        status: 'Pendiente',
        total,
        items: items.map(item => ({
          ...item,
          name: item.name,
          price: item.price,
          image_url: item.image_url
        })),
        created_at: new Date().toISOString(),
        pointsEarned: Math.floor(total),
        newTotalPoints: null
      }
      mockOrders = [newOrder, ...mockOrders]
      setOrders([...mockOrders])
      return { success: true, order: newOrder }
    }
  }

  // Simulación: actualizar estado tras 30 minutos (o inmediato para demo)
  const simulateOrderProgress = useCallback((orderId) => {
    const statusFlow = ['Pendiente', 'Preparando', 'En camino', 'Entregado']
    
    // Simular progresión de estados cada 10 segundos para demo
    statusFlow.forEach((status, index) => {
      if (index === 0) return
      setTimeout(() => {
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status } : o
        ))
        // Actualizar también en mockOrders
        mockOrders = mockOrders.map(o => 
          o.id === orderId ? { ...o, status } : o
        )
      }, index * 10000) // Cada 10 segundos avanza un estado
    })

    // A los 30 minutos, marcar como "Entregado" definitivamente
    setTimeout(() => {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: 'Entregado' } : o
      ))
      mockOrders = mockOrders.map(o => 
        o.id === orderId ? { ...o, status: 'Entregado' } : o
      )
    }, 30 * 60 * 1000) // 30 minutos
  }, [])

  return { orders, loading, createOrder, simulateOrderProgress, refetch: fetchOrders }
}
