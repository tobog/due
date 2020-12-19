
<style lang="scss">
.demo-vcarousel {
	height: 100%;
	line-height: 100px;
	text-align: center;
	color: #fff;
	font-size: 20px;
	background: #506b9e;
}
</style>


<template>
	<vCarousel autoplay v-model="value2">
		<vCarouselItem>
			<div class="demo-vcarousel">1</div>
		</vCarouselItem>
		<vCarouselItem>
			<div class="demo-vcarousel">2</div>
		</vCarouselItem>
		<vCarouselItem>
			<div class="demo-vcarousel">3</div>
		</vCarouselItem>
		<vCarouselItem>
			<div class="demo-vcarousel">4</div>
		</vCarouselItem>
		<vCarouselItem>
			<div class="demo-vcarousel">5</div>
		</vCarouselItem>
	</vCarousel>
</template>
<script>
export default {
	data() {
		return {
			value2: 0
		}
	}
}
</script>
