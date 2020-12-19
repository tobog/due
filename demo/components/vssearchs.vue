


<template>
	<main style="padding:20px 0;" class="examples-main">
		<vTemplateTable v-bind="configs">
			<!-- <div >slotProps</div> -->
			<template slot="header">
				<div>111111111</div>
				<div>111111111</div>
			</template>
		</vTemplateTable>
	</main>
</template>

<script>
// export default {

// 	data() {
// 		return {
// 			configs: {
// 				Header: [{
// 					text: "sss"
// 				}, {
// 					text: "sss",
// 					href: "/",
// 					sep: "//",
// 					show: true,
// 					radio: true,
// 				}, {
// 					text: "sss",
// 				}],
// 				Searchs: {
// 					show: true,
// 					data: [
// 						{


// 							created() {

// 							},
// 							mounted() {

// 							},

// 							beforeDestroy() {

// 							},

// 							parent: {
// 								tag: 'vFormItem',
// 								props: {
// 									label: "11"
// 								},
// 								style: "margin-left:30%;"
// 							},
// 							tag: 'vInput',
// 							key: 'name',
// 							default: "222",
// 							type: "form"
// 							// domProps: {},
// 							// props: {},
// 							// attrs: {},
// 							// on: {},
// 							// nativeOn: {},
// 							// class: {},
// 							// style: {},
// 							// directives: [{
// 							//     name: 'my-custom-directive',
// 							//     value: '2',
// 							//     expression: '1 + 1',
// 							//     arg: 'foo',
// 							//     modifiers: {
// 							//         bar: true
// 							//     }
// 							// }],
// 							// scopedSlots: {
// 							//     default: props => createElement('span', props.text)
// 							// },
// 							// slot: "other-slot",
// 							// key: 'myKey',
// 							// ref: 'myRef',
// 						},
// 						{
// 							parent: {
// 								tag: 'vFormItem',
// 								props: {
// 									label: "11"
// 								}
// 							},
// 							tag: 'vInput',
// 							key: 'name',
// 							default: "222",
// 							type: "form"
// 						},
// 						{
// 							parent: {
// 								tag: 'vFormItem',
// 								props: {
// 									label: "11"
// 								}
// 							},
// 							tag: 'vInput',
// 							key: 'name',
// 							default: "222",
// 							type: "form"
// 						},
// 						{
// 							parent: {
// 								tag: 'vFormItem',
// 								props: {
// 									label: "11"
// 								}
// 							},
// 							tag: 'vInput',
// 							key: 'name',
// 							default: "222",
// 							type: "form"
// 						},
// 						{
// 							tag: 'vSelect',
// 							key: 'vSelect',
// 							show: true,
// 							default: "11111",
// 							parent: {
// 								tag: 'vFormItem',
// 								props: {
// 									label: "11"
// 								}
// 							},
// 							created() {
// 								console.log(0)
// 								this.baseData.ops = [{
// 									value: "11",
// 								}, {
// 									value: "22",
// 								}, {
// 									value: "33",
// 								}]
// 							},
// 							children: function (h) {
// 								return this.baseData.ops.map((val) => {
// 									return h('vOption', {
// 										attrs: { ...val }
// 									})
// 								})

// 							},

// 							props: { clearable: true, },

// 						}
// 					]
// 				},
// 				Table: {
// 					show: true,
// 					radio: true,
// 					data: [
// 						{
// 							name: 'John Brown',
// 							age: 18,
// 							address: 'New York No. 1 Lake Park',
// 							date: '2016-10-03'
// 						},
// 						{
// 							name: 'Jim Green',
// 							age: 24,
// 							address: 'London No. 1 Lake Park',
// 							date: '2016-10-01'
// 						},
// 						{
// 							name: 'Joe Black',
// 							age: 30,
// 							address: 'Sydney No. 1 Lake Park',
// 							date: '2016-10-02'
// 						},
// 						{
// 							name: 'Jim Green',
// 							age: 24,
// 							address: 'London No. 1 Lake Park',
// 							date: '2016-10-01'
// 						},
// 						{
// 							name: 'Joe Black',
// 							age: 30,
// 							address: 'Sydney No. 1 Lake Park',
// 							date: '2016-10-02'
// 						}, {
// 							name: 'Jim Green',
// 							age: 24,
// 							address: 'London No. 1 Lake Park',
// 							date: '2016-10-01'
// 						},
// 						{
// 							name: 'Joe Black',
// 							age: 30,
// 							address: 'Sydney No. 1 Lake Park',
// 							date: '2016-10-02'
// 						}, {
// 							name: 'Jim Green',
// 							age: 24,
// 							address: 'London No. 1 Lake Park',
// 							date: '2016-10-01'
// 						},
// 						{
// 							name: 'Joe Black',
// 							age: 30,
// 							address: 'Sydney No. 1 Lake Park',
// 							date: '2016-10-02'
// 						}, {
// 							name: 'Jim Green',
// 							age: 24,
// 							address: 'London No. 1 Lake Park',
// 							date: '2016-10-01'
// 						},
// 						{
// 							name: 'Joe Black',
// 							age: 30,
// 							address: 'Sydney No. 1 Lake Park',
// 							date: '2016-10-02'
// 						}, {
// 							name: 'Jim Green',
// 							age: 24,
// 							address: 'London No. 1 Lake Park',
// 							date: '2016-10-01'
// 						},
// 						{
// 							name: 'Joe Black',
// 							age: 30,
// 							address: 'Sydney No. 1 Lake Park',
// 							date: '2016-10-02'
// 						}, {
// 							name: 'Jim Green',
// 							age: 24,
// 							address: 'London No. 1 Lake Park',
// 							date: '2016-10-01'
// 						},
// 						{
// 							name: 'Joe Black',
// 							age: 30,
// 							address: 'Sydney No. 1 Lake Park',
// 							date: '2016-10-02'
// 						}, {
// 							name: 'Jim Green',
// 							age: 24,
// 							address: 'London No. 1 Lake Park',
// 							date: '2016-10-01'
// 						},
// 						{
// 							name: 'Joe Black',
// 							age: 30,
// 							address: 'Sydney No. 1 Lake Park',
// 							date: '2016-10-02'
// 						}, {
// 							name: 'Jim Green',
// 							age: 24,
// 							address: 'London No. 1 Lake Park',
// 							date: '2016-10-01'
// 						},
// 						{
// 							name: 'Joe Black',
// 							age: 30,
// 							address: 'Sydney No. 1 Lake Park',
// 							date: '2016-10-02'
// 						}, {
// 							name: 'Jim Green',
// 							age: 24,
// 							address: 'London No. 1 Lake Park',
// 							date: '2016-10-01'
// 						},
// 						{
// 							name: 'Joe Black',
// 							age: 30,
// 							address: 'Sydney No. 1 Lake Park',
// 							date: '2016-10-02'
// 						}, {
// 							name: 'Jim Green',
// 							age: 24,
// 							address: 'London No. 1 Lake Park',
// 							date: '2016-10-01'
// 						},
// 						{
// 							name: 'Joe Black',
// 							age: 30,
// 							address: 'Sydney No. 1 Lake Park',
// 							date: '2016-10-02'
// 						},
// 						{
// 							name: 'Jon Snow',
// 							age: 26,
// 							address: 'Ottawa No. 2 Lake Park',
// 							date: '2016-10-04'
// 						}
// 					],
// 					columns: [
// 						{
// 							title: 'Name',
// 							key: 'name',
// 							type: "selection"
// 						},
// 						{
// 							title: 'Age',
// 							key: 'age',
// 							type: "sort",
// 							filters: [
// 								{
// 									label: 'Greater than 4000',
// 									value: 10
// 								},
// 								{
// 									label: 'Less than 4000',
// 									value: 20
// 								}
// 							],
// 							multi: {
// 								sort: true,
// 								filter: true,
// 							},
// 							filterMethod: function (val, row) {
// 								return row.age > val
// 							},
// 							sync: {
// 								sort: true,
// 								filter: true,
// 							},
// 						},
// 						{
// 							title: 'Address',
// 							key: 'address',
// 							render: () => {
// 								return <span>sssssssssssssss</span>
// 							}
// 						}
// 					],
// 				},
// 				Page: {
// 					show: true,
// 				},
// 				Model: {
// 					show: true,
// 				}
// 			},
// 		};
// 	},
// };
// </script>

