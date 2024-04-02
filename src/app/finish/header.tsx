import Link from "next/link"

export const Header = () => {
  return <header>
  <nav className="bg-white border-gray-200 px-4 lg:px-6 dark:bg-gray-800 h-20">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl h-full">
          <a className="mono justify-center items-center h-full flex text-2xl" href="/">
            <span>MonkeyType Clone</span>
          </a>
          {/* <div className="flex items-center lg:order-2">
              <a href="#" className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Log in</a>
              <a href="#" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Get started</a>
          </div> */}
          <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                  <li>
                      <Link href="/" >Another run?</Link>
                  </li>
              </ul>
          </div>
      </div>
  </nav>
</header>
}
