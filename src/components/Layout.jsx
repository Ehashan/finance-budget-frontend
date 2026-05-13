import Navbar from './Navbar'

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Navbar />
      <main className="flex-1 ml-56 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout
