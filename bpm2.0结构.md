
https://tkjohn.github.io/flowable-userguide/#bpmnUserTask

## SequenceFlow 

#### 条件顺序流

图中显示带小菱形。

```xml
<sequenceFlow id="flow" sourceRef="theStart" targetRef="theTask">
  <conditionExpression xsi:type="tFormalExpression">
    <![CDATA[${order.price > 100 && order.price < 250}]]>
  </conditionExpression>
</sequenceFlow>
```
#### 默认顺序流

所有的BPMN 2.0任务与网关都可以使用默认顺序流，默认顺序流用起点带有“斜线”标记的一般顺序流表示。


## Gateway

#### 排他网关

```xml
<exclusiveGateway id="exclusiveGw" name="Exclusive Gateway" />
```

#### 并行网关

```xml
<parallelGateway id="myParallelGateway" />
```

#### 包容网关

排他网关与并行网关的组合。

```xml
<inclusiveGateway id="myInclusiveGateway" />
```

#### 基于事件的网关

```xml
<eventBasedGateway id="gw1" />
```

## UserTask
```xml
<userTask id="theTask" name="Important task" />
```
**添加描述（description）信息**：

```xml
<userTask id="theTask" name="Schedule meeting" >
  <documentation>
      Schedule an engineering meeting for next week with the new hire.
  </documentation>
</userTask>
```
**设定到期日期**：

可以在任务定义中使用扩展指定表达式，以在任务创建时设定到期日期。
该表达式必须解析为java.util.Date，java.util.String (ISO8601格式)，ISO8601时间长度（例如PT50M），或者null。
例如，可以使用在流程里前一个表单中输入的日期，或者由前一个服务任务计算出的日期。
如果使用的是时间长度，则到期日期基于当前时间加上给定长度计算。例如当dueDate使用“PT30M”时，任务在从现在起30分钟后到期。

```xml
<userTask id="theTask" name="Important task" flowable:dueDate="${dateVariable}"/>
```

**用户指派**：

用户任务可以直接指派（assign）给用户。
可以定义humanPerformer子元素来实现。humanPerformer需要resourceAssignmentExpression来实际定义用户。
目前，只支持formalExpressions。

```xml
  <userTask id='theTask' name='important task' >
    <humanPerformer>
      <resourceAssignmentExpression>
        <formalExpression>kermit</formalExpression>
      </resourceAssignmentExpression>
    </humanPerformer>
  </userTask>
```
只能指定一个用户作为任务的humanPerformer。在Flowable术语中，这个用户被称作办理人（assignee）。拥有办理人的任务，在其他人的任务列表中不可见，而只能在该办理人的个人任务列表中看到。

任务也可以放在用户的候选任务列表中。在这个情况下，需要使用potentialOwner（潜在用户）结构。
用法与humanPerformer结构类似。请注意需要指定表达式中的每一个元素为用户还是组（引擎无法自行判断）。

如果并未指定给定字符串是用户还是组，引擎默认其为组。

```xml
  <userTask id='theTask' name='important task' >
    <potentialOwner>
      <resourceAssignmentExpression>
        <formalExpression>user(kermit), group(management)</formalExpression>
      </resourceAssignmentExpression>
    </potentialOwner>
  </userTask>
```
```java
public class MyAssignmentHandler implements TaskListener {
  public void notify(DelegateTask delegateTask) {
    // 在这里执行自定义身份查询

    // 然后调用如下命令：
    delegateTask.setAssignee("kermit");
    delegateTask.addCandidateUser("fozzie");
    delegateTask.addCandidateGroup("management");
  }
}
```

**任务监听器**
```xml
<userTask id="task1" name="My task" >
  <extensionElements>
    <flowable:taskListener event="create" class="org.flowable.MyAssignmentHandler" />
  </extensionElements>
</userTask>
```

##### 用于任务指派的Flowable扩展

很明显，当指派关系不复杂时，这种用户与组的指派方式十分笨重。为避免这种复杂性，可以在用户任务上使用自定义扩展。

- assignee（办理人)
`<userTask id="theTask" name="my task" flowable:assignee="kermit" />
`
- candidateUsers（候选用户）`<userTask id="theTask" name="my task" flowable:candidateUsers="kermit, gonzo" />
` 这个属性只能用于用户。
- candidateGroups（候选组）`<userTask id="theTask" name="my task" flowable:candidateGroups="management, accountancy" />
` 这个属性只能用于组。

```xml
<userTask id="task" name="My Task" flowable:assignee="${ldapService.findManagerForEmployee(emp)}"/>

<userTask id="task" name="My Task" flowable:candidateUsers="${ldapService.findAllSales()}"/>
```
通过调用`ldapService` Spring bean的`findManagerOfEmployee`方法，`emp`参数是一个流程变量。

调用方法的返回类型必须是String或Collection<String>（候选用户或组）

## ScriptTask

脚本任务（script task）是自动执行的活动。当流程执行到达脚本任务时，会执行相应的脚本。

脚本任务使用`script`与`scriptFormat`元素定义。

```xml
<scriptTask id="theScriptTask" name="Execute script" scriptFormat="groovy">
  <script>
    sum = 0
    for ( i in inputArray ) {
      sum += i
    }
  </script>
</scriptTask>
```
到达脚本引擎的执行中，所有的流程变量都可以在脚本中使用。

调用`execution.setVariable("variableName", variableValue)`，在脚本中设置流程变量。

默认情况下，变量不会自动储存。可以将`scriptTask`的`autoStoreVariables`参数设置为`true`，以自动保存任何在脚本中定义的变量（例如上例中的`sum`）。

```xml
<scriptTask id="script" scriptFormat="JavaScript" flowable:autoStoreVariables="false"></scriptTask>
```
这个参数的默认值为false。也就是说如果在脚本任务定义中忽略这个参数，则脚本声明的所有变量将只在脚本执行期间有效。

脚本任务的返回值，可以通过为脚本任务定义的`flowable:resultVariable`'`属性设置为流程变量。
```xml
<scriptTask id="theScriptTask" name="Execute script" scriptFormat="juel" flowable:resultVariable="myVar">
  <script>#{echo}</script>
</scriptTask>
```
当使用javascript作为脚本语言时，可以使用“安全脚本（secure scripting）”。
```xml
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-secure-javascript</artifactId>
    <version>${flowable.version}</version>
</dependency>
```
添加这个依赖会同时引入Rhino依赖，是一个用于JDK的javascript引擎。过去包含在JDK6与7中，并已被Nashorn引擎取代。然而，Rhino项目仍然在继续开发。许多（包括Flowable用于实现安全脚本的）功能都在之后才加入。

## ServiceTask

Java服务任务（Java service task）用于调用Java类。

1. 指定实现了JavaDelegate或ActivityBehavior的类。
    ```xml
    <serviceTask id="javaService"
                 name="My Java Service Task"
                 flowable:class="org.flowable.MyJavaDelegate" />
    ```




