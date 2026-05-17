import React from 'react';
import { HeroSection } from '../components/HeroSection'
import { PopularShows } from '../components/PopularShows'
import { Advantages } from '../components/Advantages'

export const Main = () => {
	return (
		<>
			<HeroSection />
			<PopularShows />
			<Advantages />
		</>
	)
}