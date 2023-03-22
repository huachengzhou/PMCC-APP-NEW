<template>
	<view>

        <view @click.stop="openModel">
           <slot></slot>
        </view>

		<view>
			<my-ming-pop ref="myMingPop" direction="below" :is_close="true" :is_mask="true" :width="100"
				height="fit-content" :maskFun="true">
				<view style="margin-top: 20rpx;" class="uni-container">
					
					<view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
						
					</view>

					

                    <view class="uni-flex uni-row" style="-webkit-justify-content: center;justify-content: center;">
                        <button class="uni-button" size="mini" type="warn"
                            @click.stop="$refs.myMingPop.close()">关闭</button>
                    </view>
				</view>
			</my-ming-pop>
		</view>

	</view>
</template>

<script>
	import * as utils from "../../../../common/untils.js";
	import myMingPop from "@/components/ming-pop/ming-pop.vue";

	export default {
		props: {
			dataValue: {
				type: [String, Number],
				default: ""
			}
		},
		watch: {},
		components: {
			"my-ming-pop": myMingPop
		},
		data() {
			return {
				disabled : false,
				selectedResults: '',
				loadingFlag: false
			};

		},
		methods: {
			openModel(){
                this.$refs.myMingPop.show();
            },
            closeModel(){
                this.$refs.myMingPop.close();
            }
		},
		created() {

		}
	}
</script>

<style>

</style>
