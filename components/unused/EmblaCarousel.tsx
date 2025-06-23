'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import styles from './EmblaCarousel.module.css'

const images = [
  'https://source.unsplash.com/random/800x300?nature',
  'https://source.unsplash.com/random/800x300?city',
  'https://source.unsplash.com/random/800x300?tech'
]

export default function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000 })
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi, onSelect])

  return (
    <div className={styles.embla}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>
          {images.map((src, index) => (
            <div className={styles.embla__slide} key={index}>
              <img src={src} className={styles.embla__slide__img} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.buttons}>
        <button className={styles.button} onClick={scrollPrev}>Prev</button>
        <button className={styles.button} onClick={scrollNext}>Next</button>
      </div>

      <div className={styles.dots}>
        {images.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === selectedIndex ? styles.dotActive : ''}`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
