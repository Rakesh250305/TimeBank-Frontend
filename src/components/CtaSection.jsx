import React from 'react'
import { Link } from 'react-router-dom'

const CtaSection = () => {
  return (
    <div>
        {/* <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Ready to Join the TimeBank?
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Start exchanging skills, earning time credits, and growing
              together with the community. Your time has value — make it count.
            </p>

            <div className="flex md:flex-row flex-col justify-center gap-6">
              <Link
                to="/signup"
                className="inline-block bg-blue-600 text-white px-2 md:px-10 py-3 rounded-xl text-base md:text-lg font-semibold shadow-lg hover:shadow-blue-300 hover:bg-blue-700 dark:hover:shadow-blue-900 transition-all duration-300"
              >
                Join Now
              </Link>
              <Link
                to="/contact"
                className="inline-block bg-blue-600 text-white px-2 md:px-10 py-3 rounded-xl text-base md:text-lg font-semibold shadow-lg hover:shadow-blue-300 hover:bg-blue-700 dark:hover:shadow-blue-900 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              No fees • Open to everyone • Skill-sharing made easy
            </p>
          </div>
        </section> */}

        <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-800 text-white overflow-hidden relative">

  {/* Glow Effect */}
  <div className="absolute inset-0 blur-3xl rounded-full -z-10"></div>

  <div className="max-w-3xl mx-auto text-center px-4">
    <h2 className="text-3xl md:text-4xl font-bold mb-4">
      Ready to Join the TimeBank?
    </h2>

    <p className="text-lg text-blue-100 mb-8">
      Start exchanging skills, earning time credits, and growing together.  
      Your time has value — make it count.
    </p>

    <div className="flex md:flex-row flex-col justify-center gap-6">

      <Link
        to="/signup"
        className="inline-block px-10 py-3 rounded-xl text-lg font-semibold
        bg-white text-blue-700 shadow-lg hover:bg-gray-200 hover:scale-[1.05] 
        transition-all duration-300"
      >
        Join Now
      </Link>

      <Link
        to="/contact"
        className="inline-block px-10 py-3 rounded-xl text-lg font-semibold
        border-2 border-white text-white hover:bg-white hover:text-blue-700 
        shadow-lg hover:scale-[1.05] transition-all duration-300"
      >
        Contact Us
      </Link>

    </div>

    <p className="text-sm text-blue-200 mt-4">
      No fees • Open to everyone • Skill-sharing made easy
    </p>
  </div>
</section>

    </div>
  )
}

export default CtaSection
