import React from 'react'
import { assets } from '../assets/assets'
import { motion } from "framer-motion"

const Description = () => {
  return (
    <motion.div 
    initial={{opacity:0.2, y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
    className='flex flex-col items-center
    justify-center my-24 p-6 md:px-28'>
        <h1 className='text-3xl sm:text-4xl font-semibold
        mb-2'>
            AI-Powered Creations
        </h1>
        <p className='text-gray-500 mb-8'>
            See your imagination come alive
        </p>

        <div className='flex flex-col gap-5 md:gap-14 md:flex-row
        items-center'>
            <img src={assets.sample_img_1} alt="" className='w-80
            xl:w-96 rounded-lg' />
            <div>
                <h2 className='text-3xl font-medium max-w-xl
                mb-4'>
                    Introducing the AI-Powered Text to Image Generator
                </h2>
                <p className='text-gray-600 mb-4'>
                    Quickly turn your ideas into visuals with our free AI image generator. 
                    Whether you want creative designs or unique artwork, our tool converts 
                    your text into striking images in just a few clicks. 
                    Imagine it, describe it, and see it come to life instantly.
                </p>
                <p className='text-gray-600'>
                    Just enter a text prompt, and our advanced AI will craft 
                    stunning images within seconds. From product designs to 
                    characters and portraits, even ideas that don't exist yet can 
                    be visualized with ease. Powered by next-gen AI, your 
                    creative possibilities are endless!
                </p>
        </div>
    </div>

</motion.div>
  )
}

export default Description