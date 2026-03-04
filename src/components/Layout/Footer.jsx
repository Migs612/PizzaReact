// =============================================
// Footer Component
// =============================================
export default function Footer() {
  return (
    <footer className="bg-pizza-black text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍕</span>
              <span className="text-white font-bold text-xl">
                PIZZA<span className="text-pizza-red">REACT</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              La mejor pizza artesanal de la ciudad. Ingredientes frescos, masa hecha a mano y mucho amor en cada porción.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider">MENÚ</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Pizzas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bebidas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Postres</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ofertas</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider">CONTACTO</h3>
            <ul className="space-y-2 text-sm">
              <li><i className="fas fa-phone mr-2" /> +34 912 345 678</li>
              <li><i className="fas fa-envelope mr-2" /> info@pizzareact.es</li>
              <li><i className="fas fa-map-marker-alt mr-2" /> Calle Gran Vía, 28, Madrid</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider">HORARIO</h3>
            <ul className="space-y-2 text-sm">
              <li>Lun - Vie: 11:00 - 23:00</li>
              <li>Sáb - Dom: 12:00 - 00:00</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl">
                <i className="fab fa-instagram" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl">
                <i className="fab fa-facebook" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl">
                <i className="fab fa-twitter" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2026 PizzaReact. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
