import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

gsap.config({ nullTargetWarn: false })

export { gsap, ScrollTrigger, useGSAP }
