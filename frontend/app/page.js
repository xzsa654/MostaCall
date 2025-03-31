'use client'

import React, { useState, useEffect, useRef } from 'react'
import LoginPage from './components/login'
import Image from 'next/image'
import { motion } from 'framer-motion'
import ShinyText from './components/shinyText'
import AnimatedContent from './components/AnimatedContent'
import Aurora from './components/Aurora '
import Particles from './components/Particles'
import SpotlightCard from './components/spotlightCard'
import Stepper, { Step } from './components/Stepper'
import {
  FaCode,
  FaGithub,
  FaUserFriends,
  FaHeart,
  FaComments,
} from 'react-icons/fa'
import Lenis from 'lenis'
import TinderCard from 'react-tinder-card'
import ScrollVelocity from './components/ScrollVelcity'
import { useScroll, useTransform } from 'framer-motion'

export default function AppPage(props) {
  useEffect(() => {
    const lenis = new Lenis()
    const raf = (time) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [])

  const containerRef = useRef()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <>
      <div className="relative h-[300vh]" ref={containerRef}>
        <Section1 scrollYProgress={scrollYProgress} />
        <Section2 scrollYProgress={scrollYProgress} />
        <Section3 scrollYProgress={scrollYProgress} />
      </div>
    </>
  )
}

const Section1 = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0, 0.33], [1, 0.8])
  const rotate = useTransform(scrollYProgress, [0, 0.33], [0, -10])

  return (
    <motion.div
      style={{ scale, rotate }}
      className="sticky top-0 mt-16 flex flex-col items-center overflow-hidden"
    >
      <Aurora
        colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <div
        className="flex flex-col justify-center absolute items-center"
        style={{ width: '100%', height: '1600px' }}
      >
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className="flex flex-col justify-between mt-10">
        <div className="text-center">
          <ShinyText
            text="MostaCall"
            speed={2}
            className="text-6xl md:text-9xl lg:text-[200px] tracking-widest"
          />
          <AnimatedContent
            distance={150}
            direction="vertical"
            reverse={false}
            config={{ tension: 80, friction: 20 }}
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
          >
            <div className="text-2xl md:text-5xl text-end lg:pr-8 pr-2">
              easy scroll & easy match
            </div>
          </AnimatedContent>
        </div>
      </div>
      <div className="w-full p-15 gap-5 h-auto flex flex-col lg:flex-row justify-between">
        <div className="w-auto flex justify-center lg:order-1 order-2">
          <AnimatedContent
            distance={150}
            direction="vertical"
            reverse={false}
            config={{ tension: 80, friction: 20 }}
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
          >
            <TinderCard
              className="shadow-none inset-0 m-auto w-fit h-fit lg:block hidden"
              swipeRequirementType="position"
              preventSwipe={['up', 'down']}
            >
              <div
                className="card bg-white w-[300px] h-[28rem] select-none rounded-lg overflow-hidden border
                 border-gray-200"
              >
                <figure className="px-4 pt-4 h-3/4">
                  <img
                    src={`/avatar.jpg`}
                    alt={'default'}
                    className="rounded-lg object-cover h-full pointer-events-none"
                  />
                </figure>
                <div className="card-body bg-gradient-to-b from-white to-pink-50">
                  <h2 className="card-title text-2xl text-gray-800">
                    Emily,20
                  </h2>
                </div>
              </div>
            </TinderCard>
          </AnimatedContent>
        </div>
        <div className="flex justify-center items-center w-full order-1 lg:order-2">
          <AnimatedContent>
            <LoginPage />
          </AnimatedContent>
        </div>
        <div className="order-3 gap-2 flex-col flex">
          <AnimatedContent>
            <SpotlightCard className="custom-spotlight-card h-52 lg:flex hidden  flex-col justify-between">
              <div className="flex gap-2">
                <FaCode size={25} />
                <span className="font-bold">Code</span>
              </div>
              <div>
                <h3 className="text-xl font-bold"></h3>
                <p>You can see the code of this component here.</p>
              </div>
              <a
                href="https://github.com/xzsa654/EventureArts-next"
                className="w-24 items-center gap-2 flex text-secondary border p-2 rounded-full"
              >
                <FaGithub size={20} />
                github
              </a>
            </SpotlightCard>
          </AnimatedContent>
        </div>
      </div>
    </motion.div>
  )
}

const Section2 = ({ scrollYProgress }) => {
  // 第一個過渡：從第一個 section 到第二個 section
  const scaleIn = useTransform(scrollYProgress, [0.33, 0.5], [0.8, 1])
  // 第二個過渡：從第二個 section 到第三個 section
  const scaleOut = useTransform(scrollYProgress, [0.66, 0.75], [1, 0.8])

  // 組合兩個縮放效果
  const scale = useTransform(
    [scaleIn, scaleOut],
    ([scaleInValue, scaleOutValue]) => {
      if (scrollYProgress.get() < 0.5) return scaleInValue
      return scaleOutValue
    }
  )

  // 第一個過渡：從第一個 section 到第二個 section
  const rotateIn = useTransform(scrollYProgress, [0.33, 0.5], [-5, 0])
  // 第二個過渡：從第二個 section 到第三個 section
  const rotateOut = useTransform(scrollYProgress, [0.66, 0.75], [0, -5])

  // 組合兩個旋轉效果
  const rotate = useTransform(
    [rotateIn, rotateOut],
    ([rotateInValue, rotateOutValue]) => {
      if (scrollYProgress.get() < 0.5) return rotateInValue
      return rotateOutValue
    }
  )

  const PREVIEW_MESSAGES = [
    { id: 1, content: "Hey! How's it going?" },
    {
      id: 2,
      content: "I'm doing great! Just working on some new features.",
    },
  ]

  return (
    <motion.div
      style={{ scale, rotate }}
      className="h-screen sticky top-0 mt-14 bg-[url(/love-mobile.jpg)] flex flex-col pb-6 sm:gap-12 justify-between sm:justify-center bg-center bg-no-repeat min-[500px]:bg-[url(/love.jpg)] sm:bg-[url(/love.jpg)] min-[500px]:bg-cover bg-[500px,100px]"
    >
      <div></div>
      <div>
        <Stepper
          initialStep={1}
          onStepChange={(step) => {
            console.log(step)
          }}
          onFinalStepCompleted={() => console.log('All steps completed!')}
          backButtonText="Previous"
          nextButtonText="Next"
        >
          <Step>
            <h2 className="text-xl">Welcome to the MostaCall!</h2>
            <p>Register a new account !</p>
          </Step>
          <Step>
            <h2>Step 2 Custom your profile!</h2>
            <img
              style={{
                height: '100px',
                width: '100%',
                objectFit: 'cover',
                objectPosition: 'center -70px',
                borderRadius: '15px',
                marginTop: '1em',
              }}
              src="https://www.purrfectcatgifts.co.uk/cdn/shop/collections/Funny_Cat_Cards_640x640.png?v=1663150894"
            />
          </Step>
          <Step>
            <h2 className="text-xl">Step 3 Chat with someone !</h2>
            <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] rounded-4xl overflow-y-auto bg-base-100">
              {PREVIEW_MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isSent ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${
                            message.isSent
                              ? 'bg-primary text-primary-content'
                              : 'bg-base-200'
                          }
                        `}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`
                            text-[10px] mt-1.5
                            ${
                              message.isSent
                                ? 'text-primary-content/70'
                                : 'text-base-content/70'
                            }
                          `}
                    >
                      12:00 PM
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Step>
          <Step>
            <h2>Final Step</h2>
            <div className="w-full flex justify-center">
              <Image
                src="/love.jpg"
                width={300}
                height={300}
                alt="love"
              ></Image>
            </div>
            <p className="text-xl">You made it!</p>
          </Step>
        </Stepper>
      </div>
      <ScrollVelocity
        texts={[
          '愛は他人と',
          'Life is the flower for which love is the honey.',
        ]}
        // velocity={velocity}
        className="custom-scroll-text"
      />
    </motion.div>
  )
}

const Section3 = ({ scrollYProgress }) => {
  const scale = useTransform(scrollYProgress, [0.75, 0.9], [0.8, 1])
  const rotate = useTransform(scrollYProgress, [0.75, 0.9], [-5, 0])
  const opacity = useTransform(scrollYProgress, [0.7, 0.8], [0, 1])

  const features = [
    {
      icon: <FaUserFriends size={30} />,
      title: 'Find New Friends',
      description: 'Connect with like-minded people from around the world.',
    },
    {
      icon: <FaHeart size={30} />,
      title: 'Match Instantly',
      description: 'Our algorithm helps you find your perfect match faster.',
    },
    {
      icon: <FaComments size={30} />,
      title: 'Effortless Communication',
      description: 'Chat securely with real-time translation in 30+ languages.',
    },
  ]

  return (
    <motion.div
      style={{ scale, rotate, opacity }}
      className="h-screen sticky top-0 flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-purple-200 overflow-hidden"
    >
      <Aurora
        colorStops={['#FF94B4', '#3A29FF', '#FF3232']}
        blend={0.3}
        amplitude={0.8}
        speed={0.4}
      />

      <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        <AnimatedContent
          distance={100}
          direction="vertical"
          config={{ tension: 80, friction: 20 }}
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-12 text-gray-800">
            Why Choose <span className="text-pink-600">MostaCall</span>
          </h2>
        </AnimatedContent>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {features.map((feature, index) => (
            <AnimatedContent
              key={index}
              distance={100}
              direction="vertical"
              config={{ tension: 80, friction: 20 }}
              initialOpacity={0.2}
              animateOpacity
              scale={1.1}
              threshold={0.2}
              delay={index * 0.1}
            >
              <SpotlightCard className="h-64 flex flex-col items-center text-center p-6 bg-white/90 rounded-2xl">
                <div className="text-pink-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>

        <AnimatedContent
          distance={100}
          direction="vertical"
          config={{ tension: 80, friction: 20 }}
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          delay={0.3}
        >
          <div className="text-center mt-16">
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Get Started Today
            </button>
          </div>
        </AnimatedContent>
      </div>

      <ScrollVelocity
        texts={[
          '愛の旅へようこそ',
          'The greatest happiness of life is the conviction that we are loved.',
        ]}
        className="custom-scroll-text"
      />
    </motion.div>
  )
}
