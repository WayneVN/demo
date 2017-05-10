/**
 * @author: chenmin
 * @email: min.chen@joudou.com
 * @Desc: "新记账－上传流水页面－编辑表单"
 */

require('table-root/dist/fixed-data-table.min.css');
var React = require('react');
var FixedDataTable = require('fixed-data-table');
const {Table, Column} = FixedDataTable;
const moment = require('moment');
const numeral = require('numeral');

const UploadTable = React.createClass({
  getInitialState() {
    return {
      addItem: {},
      showToolPanel: true,
    };
  },

  getDefaultProps() {
    return {
      addItem: null
    };
  },

  rowGetter(rowIndex) {
    return this.props.rows[rowIndex];
  },

  componentDidMount() {
  },

  formatSecurityName(cellData, cellDataKey, rowData, rowIndex, columnData, width) {
    let name = this.props.rows[rowIndex].security_name;
    if (!name) {
      return '';
    }
    return name.length >= 6 ? name.substr(0,5) + '...': name;
  },

  formatBusiness(cellData, cellDataKey, rowData, rowIndex, columnData, width) {
    let name = this.props.rows[rowIndex].ori_business;
    if (!name) {
      return '';
    }

    return (
      <span className="text-overflow" style={{
        display: 'inlineBlock',
        width: 90
      }}>
        {name}
      </span>
    );

  },

  cellRenderers(cellData, cellDataKey, rowData, rowIndex, columnData, width) {
    let status = this.props.rows[rowIndex].calc_status;
    let err = this.props.rows[rowIndex].error_cols;
    let styles = {};
    let icon = '';
    let statusName = '';

    if (status) {
      statusName = 'color-down';
      icon = 'fa-check';
    }
    else {
      let err_business = _.findIndex(err, o => o == 'business');
      let err_other = _.findIndex(err, o => (o == 'code' || o == 'num'));
      // 业务错误
      if (err_business >= 0) {
        statusName = 'color-up';
        icon = 'fa-times';
      }
      // 代码错或数据错
      if (err_other >= 0) {
        icon = 'fa-exclamation-triangle';
        styles = {
          color: '#fdc532'
        };
      }
    }
    return (
      <span className={statusName} style={styles}>
         <i className={`fa ${icon}`} />
      </span>
    );
  },

  render() {
    const {
      props: {
        rows,
        total
      }
    } = this;

    return (
      <Table
          rowHeight={40}
          rowGetter={this.rowGetter}
          rowsCount={total}
          width={920}
          height={500}
          overflowY={'auto'}
          overflowX={'auto'}
          headerHeight={40}>
        <Column
            label="发生日期"
            width={104}
            dataKey={"date"}
            align={"center"}
        />
        <Column
            label="业务名称"
            width={146}
            dataKey={'business'}
            align={"center"}
            cellRenderer={this.formatBusiness}
        />
        <Column
            label="证券代码"
            width={92}
            dataKey={'code'}
            align={"center"}
        />
        <Column
            label="股票名称"
            width={100}
            align={"center"}
            dataKey={'security_name'}
            cellRenderer={this.formatSecurityName}
        />
        <Column
            label="成交价格"
            width={92}
            dataKey={'price'}
            align={"center"}
        />
        <Column
            label="成交数量"
            width={94}
            dataKey={'num'}
            align={"center"}
        />
        <Column
            label="发生金额"
            width={98}
            dataKey={'amount'}
            align={"center"}
        />
        <Column
            label="资金余额"
            width={100}
            dataKey={'balance'}
            align={"center"}
        />
        <Column
            label="识别结果"
            width={92}
            dataKey={'calc_status'}
            cellRenderer={this.cellRenderers}
            align={"center"}

        />
      </Table>
    );
  }
});

module.exports = UploadTable;
