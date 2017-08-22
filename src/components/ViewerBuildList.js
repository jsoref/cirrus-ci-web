import PropTypes from 'prop-types';
import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import {withRouter} from 'react-router-dom'

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';

import {
  Table,
  TableBody,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import {cirrusColors} from "../cirrusTheme";
import {formatDuration} from "../utils/time";
import {buildStatusColor} from "../utils/colors";
import {buildStatusIconName, buildStatusMessage} from "../utils/status";


class ViewerBuildList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    let styles = {
      main: {
        paddingTop: 8
      },
      chip: {
        margin: 4,
      },
    };

    let edges = this.props.viewer.builds.edges;
    return (
      <div style={styles.main} className="container">
        <Paper zDepth={1} rounded={false}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text="Recent Builds"/>
            </ToolbarGroup>
          </Toolbar>
          <Table selectable={false} style={{tableLayout: 'auto'}}>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {edges.map(edge => this.buildItem(edge.node, styles))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }

  buildItem(build, styles) {
    return (
      <TableRow key={build.id}
                onMouseDown={() => this.handleBuildClick(build.id)}
                style={{cursor: "pointer"}}>
        <TableRowColumn style={{padding: 0}}>
          <Chip style={styles.chip}>
            <Avatar backgroundColor={cirrusColors.cirrusPrimary}
                    icon={<FontIcon className="material-icons">storage</FontIcon>} />
            {build.repository.fullName}
          </Chip>
          <Chip style={styles.chip}>
            <Avatar backgroundColor={cirrusColors.cirrusPrimary}
                    icon={<FontIcon className="material-icons">call_split</FontIcon>} />
            {build.branch}#{build.changeIdInRepo.substr(0, 6)}
          </Chip>
        </TableRowColumn>
        <TableRowColumn style={{width: '100%'}}>{build.changeMessageTitle}</TableRowColumn>
        <TableRowColumn style={{padding: 0}}>
          <Chip style={styles.chip}>
            <Avatar backgroundColor={buildStatusColor(build.status)}
                    icon={<FontIcon className="material-icons">{buildStatusIconName(build.status)}</FontIcon>} />
            {buildStatusMessage(build)}
          </Chip>
        </TableRowColumn>
      </TableRow>
    );
  }

  handleBuildClick(buildId) {
    this.context.router.history.push("/build/" + buildId)
  }
}

export default createFragmentContainer(withRouter(ViewerBuildList), {
  viewer: graphql`
    fragment ViewerBuildList_viewer on User {
      builds(last: 100) {
        edges {
          node {
            id
            branch
            changeIdInRepo
            changeMessageTitle
            status
            authorName
            changeTimestamp
            buildStartedTimestamp
            buildDurationInSeconds
            repository {
              fullName
            }
          }
        }
      }
    }
  `,
});
