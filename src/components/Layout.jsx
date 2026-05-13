import Navbar from './Navbar'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main
        className="
          min-h-screen
          pt-16
          px-4
          py-4

          sm:px-6
          sm:py-6

          md:px-8
          md:py-8

          lg:ml-72
          lg:pt-8
        "
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout