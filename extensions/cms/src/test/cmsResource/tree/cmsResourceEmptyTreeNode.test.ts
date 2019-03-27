/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as should from 'should';
import * as vscode from 'vscode';
import 'mocha';
import { CmsResourceEmptyTreeNode } from '../../../cmsResource/tree/cmsResourceEmptyTreeNode';
import { CmsResourceItemType } from '../../../cmsResource/constants';


describe('CmsResourceEmptyTreeNode.info', function(): void {
	it('Should be correct.', async function(): Promise<void> {
		const label = 'Register Central Management Server';

		const treeNode = new CmsResourceEmptyTreeNode();

		should(treeNode.nodePathValue).equal('message_accountNotSignedIn');

		const treeItem = await treeNode.getTreeItem();
		should(treeItem.label).equal(label);
		should(treeItem.contextValue).equal(CmsResourceItemType.cmsEmptyNodeContainer);
		should(treeItem.collapsibleState).equal(vscode.TreeItemCollapsibleState.None);
		should(treeItem.command).not.undefined();
		should(treeItem.command.title).equal(label);
		should(treeItem.command.command).equal('cms.resource.registerCMSServer');

		const nodeInfo = treeNode.getNodeInfo();
		should(nodeInfo.isLeaf).true();
		should(nodeInfo.label).equal(label);
		should(nodeInfo.nodeType).equal(CmsResourceItemType.cmsEmptyNodeContainer);
		should(nodeInfo.iconType).equal(CmsResourceItemType.cmsEmptyNodeContainer);
	});
});
